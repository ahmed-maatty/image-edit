import { Link, useLocation } from "react-router-dom";
import Aside from "../fragments/dashboard/Aside";
import { useDashboardNav } from "../../hooks/DashboardNavHook";
import { DashboardNav } from "../fragments/dashboard/DashboardNav";
import { useRef, useEffect, useState, useMemo } from "react";
import { fabric } from "fabric";
import * as imglyBackgroundRemoval from "@imgly/background-removal";
import {
  Album,
  AR,
  BG,
  BgRemove,
  Blur,
  Color,
  Colors,
  Contrast,
  Crop,
  Delete,
  Duplicate,
  EN,
  Erase,
  Fill,
  FontLock,
  Gradiants,
  ImageGenerator,
  Layers,
  Opacity,
  Photo,
  Redo,
  Replace,
  Resize,
  Shadow,
  Stickers,
  Text,
  TextArt,
  Undo,
} from "../fragments/Editor/Icons";
import toast from "react-hot-toast";

// ===== helpers =====
const STORAGE_KEY = "editor_canvas_json_v1";

// throttle simple
const throttle = (fn, delay = 500) => {
  let last = 0;
  let timer;
  return (...args) => {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn(...args);
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        last = Date.now();
        fn(...args);
      }, delay - (now - last));
    }
  };
};

function Editor() {
  const { active, handleActive, handleSearch } = useDashboardNav();
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  // tools & ui
  const [activeTool, setActiveTool] = useState(null);
  const [filterValue, setFilterValue] = useState(50);
  const [showLayersPanel, setShowLayersPanel] = useState(false);
  const [layers, setLayers] = useState([]);
  const fileInputRef = useRef(null);

  // eraser controls
  const [eraserSize, setEraserSize] = useState(30);
  const [isRestoreMode, setIsRestoreMode] = useState(false);
  const supportsFabricEraser = useMemo(() => !!fabric?.EraserBrush, []);

  // history
  const history = useRef([]);
  const historyIndex = useRef(-1);

  // crop
  const cropRectRef = useRef(null);
  const isDrawing = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const cropTargetRef = useRef(null);

  // bg remover state
  const [isRemovingBg, setIsRemovingBg] = useState(false);

  useEffect(() => {
    setFilterValue(50);
  }, [activeTool]);

  // init canvas
  useEffect(() => {
    const canvasObj = new fabric.Canvas(canvasRef.current, {
      width: 600,
      height: 500,
      isDrawingMode: false,
      preserveObjectStacking: true,
    });

    fabric.Image.fromURL("/media/dottedimage.png", (img) => {
      img.set({
        left: 0,
        top: 0,
        selectable: false,
        evented: false,
        scaleX: canvasObj.width / img.width,
        scaleY: canvasObj.height / img.height,
      });
      canvasObj.add(img);
      canvasObj.sendToBack(img);

      const fillRect = new fabric.Rect({
        left: 0,
        top: 0,
        width: canvasObj.width,
        height: canvasObj.height,
        fill: "transparent",
        selectable: false,
        evented: false,
      });

      canvasObj.add(fillRect);
      canvasObj.sendToBack(fillRect);
      canvasObj.renderAll();

      setCanvas(canvasObj);

      canvasObj.fillRect = fillRect;
    });

    return () => canvasObj.dispose();
  }, []);

  // load from storage on first ready
  useEffect(() => {
    if (!canvas) return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const json = JSON.parse(saved);
        canvas.loadFromJSON(json, () => {
          canvas.renderAll();
          // init history with loaded state
          saveCanvasState(canvas);
        });
      } catch {
        // ignore
        saveCanvasState(canvas);
      }
    } else {
      // first state
      saveCanvasState(canvas);
    }
  
    const uploadedImage = localStorage.getItem("uploadedImage")

    fabric.Image.fromURL(uploadedImage, (img) => {
    canvas.add(img);
    canvas.renderAll();

    persistCanvas(canvas);
    saveCanvasState(canvas);
  });

    const bgUrl = localStorage.getItem("BackGroundUrl");
    if (bgUrl) {
      fabric.Image.fromURL(
        bgUrl,
        (img) => {
          img.set({
            left: 0,
            top: 0,
            selectable: false,
            evented: false,
            scaleX: canvas.width / img.width,
            scaleY: canvas.height / img.height,
          });

          canvas.add(img);
          canvas.renderAll();
          saveCanvasState(canvas);
        },
        {
          crossOrigin: "anonymous",
        }
      );
    } else {
      saveCanvasState(canvas);
    }
  }, [canvas]);

  // save layers & autosave on changes
  useEffect(() => {
    if (!canvas) return;

    const updateLayers = () => {
      const objects = canvas.getObjects();
      const filtered = objects.filter((obj) => {
        if (!obj.visible || obj.opacity === 0) return false;
        if (
          obj.type === "group" &&
          (!obj._objects || obj._objects.length === 0)
        )
          return false;
        return true;
      });

      const newLayers = filtered.map((obj, index) => ({
        id: obj.id || `layer-${index}-${Date.now()}`,
        name: obj.name || `Layer ${filtered.length - index}`,
        visible: obj.visible !== false,
        locked: obj.selectable === false,
        object: obj,
        index,
      }));

      setLayers(newLayers.reverse()); // top first
    };

    const autosave = throttle(() => {
      persistCanvas(canvas);
    }, 700);

    const onAnyChange = () => {
      updateLayers();
      saveCanvasState(canvas);
      autosave();
    };

    canvas.on("object:added", onAnyChange);
    canvas.on("object:removed", onAnyChange);
    canvas.on("object:modified", onAnyChange);
    canvas.on("object:moved", onAnyChange);
    canvas.on("path:created", onAnyChange);
    canvas.on("selection:updated", updateLayers);
    canvas.on("selection:created", updateLayers);
    canvas.on("selection:cleared", updateLayers);

    updateLayers();

    return () => {
      canvas.off("object:added", onAnyChange);
      canvas.off("object:removed", onAnyChange);
      canvas.off("object:modified", onAnyChange);
      canvas.off("object:moved", onAnyChange);
      canvas.off("path:created", onAnyChange);
      canvas.off("selection:updated", updateLayers);
      canvas.off("selection:created", updateLayers);
      canvas.off("selection:cleared", updateLayers);
    };
  }, [canvas]);

  // ===== persistence & history =====
  const persistCanvas = (c) => {
    try {
      const json = c.toJSON([
        "id",
        "name",
        "selectable",
        "erasable",
        "clipPath",
        "shadow",
        "opacity",
        "visible",
        "lockMovementX",
        "lockMovementY",
        "evented",
      ]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(json));
    } catch {}
  };

  const saveCanvasState = (c) => {
    try {
      const json = c.toJSON([
        "id",
        "name",
        "selectable",
        "erasable",
        "clipPath",
        "shadow",
        "opacity",
        "visible",
        "lockMovementX",
        "lockMovementY",
        "evented",
      ]);
      const state = JSON.stringify(json);
      history.current = history.current.slice(0, historyIndex.current + 1);
      history.current.push(state);
      historyIndex.current = history.current.length - 1;
    } catch {}
  };

  const loadCanvasState = (state) => {
    const json = JSON.parse(state);
    canvas.loadFromJSON(json, () => {
      canvas.renderAll();
      persistCanvas(canvas);
    });
  };

  const undo = () => {
    if (historyIndex.current <= 0) return;
    historyIndex.current--;
    loadCanvasState(history.current[historyIndex.current]);
  };

  const redo = () => {
    if (historyIndex.current >= history.current.length - 1) return;
    historyIndex.current++;
    loadCanvasState(history.current[historyIndex.current]);
  };

  // ===== image I/O =====
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      fabric.Image.fromURL(
        dataUrl,
        (img) => {
          // scale to fit (max width 500)
          const maxW = Math.min(500, canvas.getWidth() - 40);
          if (img.width > maxW) {
            img.scaleToWidth(maxW);
          }
          img.set({
            left: canvas.width / 2,
            top: canvas.height / 2,
            originX: "center",
            originY: "center",
            selectable: true,
            erasable: true,
            id: `image-${Date.now()}`,
            name: "Image",
          });
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
          saveCanvasState(canvas);
          persistCanvas(canvas);
        },
        { crossOrigin: "anonymous" }
      );
    };
    reader.readAsDataURL(file);
    // reset input so same file can be reselected
    e.target.value = "";
  };

  const handleReplaceImage = (e) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type !== "image") {
      toast.error("Please select an image to replace.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (f) => {
      const dataUrl = f.target.result;

      fabric.Image.fromURL(
        dataUrl,
        (newImg) => {
          newImg.set({
            left: activeObject.left,
            top: activeObject.top,
            scaleX: activeObject.scaleX,
            scaleY: activeObject.scaleY,
            angle: activeObject.angle,
            flipX: activeObject.flipX,
            flipY: activeObject.flipY,
            originX: activeObject.originX,
            originY: activeObject.originY,
            selectable: true,
            erasable: true,
            id: `image-${Date.now()}`,
            name: "Replaced Image",
          });

          // keep filters if any
          if (activeObject.filters?.length) {
            newImg.filters = [...activeObject.filters];
            newImg.applyFilters();
          }

          canvas.remove(activeObject);
          canvas.add(newImg);
          canvas.setActiveObject(newImg);
          canvas.renderAll();
          saveCanvasState(canvas);
          persistCanvas(canvas);
        },
        { crossOrigin: "anonymous" }
      );
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const deleteSelected = () => {
    if (!canvas) return;
    const selection = canvas.getActiveObjects();
    if (selection.length) {
      selection.forEach((obj) => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      saveCanvasState(canvas);
      persistCanvas(canvas);
    } else {
      toast.error("Select object(s) to delete");
    }
  };

  // ===== filters & tools =====
  const applyFilter = (filterType) => {
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (!obj) {
      toast.error("Please select object first");
      return;
    }

    if (filterType === "opacity") {
      obj.set("opacity", Number(filterValue) / 100);
      canvas.requestRenderAll();
      saveCanvasState(canvas);
      persistCanvas(canvas);
      return;
    }

    if (obj.type !== "image") {
      toast.error(`${filterType} works on images only`);
      return;
    }

    // remove same type filter(s)
    obj.filters = (obj.filters || []).filter((f) => {
      const t = (f && f.type) || "";
      if (filterType === "blur") return t !== "Blur";
      if (filterType === "contrast") return t !== "Contrast";
      return true;
    });

    if (filterType === "blur") {
      obj.filters.push(
        new fabric.Image.filters.Blur({ blur: Number(filterValue) / 100 })
      );
    } else if (filterType === "contrast") {
      obj.filters.push(
        new fabric.Image.filters.Contrast({
          contrast: Number(filterValue) / 100,
        })
      );
    }

    obj.applyFilters();
    canvas.requestRenderAll();
    saveCanvasState(canvas);
    persistCanvas(canvas);
  };

  // ===== Eraser Tool (Canvas-like) =====
  const startErasing = () => {
    if (!canvas) return;

    setActiveTool("erase");
    canvas.isDrawingMode = true;

    if (supportsFabricEraser) {
      // Fabric v5+ EraserBrush (non-destructive)
      const eraser = new fabric.EraserBrush(canvas);
      eraser.width = eraserSize;
      eraser.inverted = !!isRestoreMode;
      canvas.freeDrawingBrush = eraser;

      canvas.getObjects().forEach((obj) => {
        obj.set({ erasable: true });
        if (obj._objects)
          obj._objects.forEach((sub) => sub.set({ erasable: true }));
      });
    } else {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.width = eraserSize;

      toast(
        (t) => (
          <span>
            Advanced Eraser needs Fabric v5. Using basic brush fallback.
          </span>
        ),
        { id: "fabric-eraser-warning" }
      );

      canvas.selection = false;
      canvas.forEachObject((o) => (o.selectable = false));
    }

    canvas.requestRenderAll();
  };

  const stopErasing = () => {
    if (!canvas) return;
    setActiveTool(null);
    canvas.isDrawingMode = false;
    canvas.selection = true;
    canvas.forEachObject(
      (o) => (o.selectable = o.selectable !== false ? true : o.selectable)
    );
    canvas.renderAll();
  };

  useEffect(() => {
    if (!canvas) return;
    if (activeTool === "erase" && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = eraserSize;
      if (supportsFabricEraser && "inverted" in canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.inverted = !!isRestoreMode;
      }
      canvas.requestRenderAll();
    }
  }, [eraserSize, isRestoreMode, activeTool, canvas, supportsFabricEraser]);

  // ===== crop (cut) =====
  const handleCropMouseDown = (opt) => {
    const pointer = canvas.getPointer(opt.e);
    startX.current = pointer.x;
    startY.current = pointer.y;
    isDrawing.current = true;

    cropRectRef.current = new fabric.Rect({
      left: startX.current,
      top: startY.current,
      width: 0,
      height: 0,
      fill: "rgba(0,0,0,0.25)",
      stroke: "#666",
      strokeWidth: 1,
      selectable: false,
      evented: false,
    });

    canvas.add(cropRectRef.current);
  };

  const handleCropMouseMove = (opt) => {
    if (!isDrawing.current || !cropRectRef.current) return;
    const pointer = canvas.getPointer(opt.e);

    // bounding to selected image
    const image = cropTargetRef.current;
    if (!image) return;

    const imgBounds = {
      left: image.left - (image.width * image.scaleX) / 2,
      right: image.left + (image.width * image.scaleX) / 2,
      top: image.top - (image.height * image.scaleY) / 2,
      bottom: image.top + (image.height * image.scaleY) / 2,
    };

    const x = Math.max(imgBounds.left, Math.min(pointer.x, imgBounds.right));
    const y = Math.max(imgBounds.top, Math.min(pointer.y, imgBounds.bottom));

    const w = x - startX.current;
    const h = y - startY.current;

    cropRectRef.current.set({
      width: Math.abs(w),
      height: Math.abs(h),
      left: w < 0 ? x : startX.current,
      top: h < 0 ? y : startY.current,
    });

    canvas.renderAll();
  };

  const handleCropMouseUp = () => {
    isDrawing.current = false;
  };

  const startCropping = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active || active.type !== "image") {
      toast.error("Select an image first, then start crop");
      return;
    }
    cropTargetRef.current = active;

    setActiveTool("crop");
    canvas.selection = false;
    canvas.defaultCursor = "crosshair";
    canvas.discardActiveObject();

    canvas.forEachObject((obj) => {
      obj.selectable = false;
      obj.evented = false;
    });

    canvas.on("mouse:down", handleCropMouseDown);
    canvas.on("mouse:move", handleCropMouseMove);
    canvas.on("mouse:up", handleCropMouseUp);

    canvas.requestRenderAll();
  };

  const applyCrop = () => {
    if (!canvas || activeTool !== "crop" || !cropRectRef.current) {
      toast.error("Draw a crop area first");
      setActiveTool(null);
      return;
    }

    const image = cropTargetRef.current;
    if (!image || image.type !== "image") {
      toast.error("No image selected for crop");
      cancelCrop();
      return;
    }

    const cropRect = cropRectRef.current;

    // translate rect (canvas coords) -> image coords (before scale/rotate)
    const imgLeft = image.left - (image.width * image.scaleX) / 2;
    const imgTop = image.top - (image.height * image.scaleY) / 2;

    const cropX = (cropRect.left - imgLeft) / image.scaleX;
    const cropY = (cropRect.top - imgTop) / image.scaleY;
    const cropW = cropRect.width / image.scaleX;
    const cropH = cropRect.height / image.scaleY;

    // draw to offscreen canvas then replace
    const el = image.getElement();
    const off = document.createElement("canvas");
    off.width = Math.max(1, Math.floor(cropW));
    off.height = Math.max(1, Math.floor(cropH));
    const ctx = off.getContext("2d");
    ctx.drawImage(
      el,
      Math.max(0, cropX),
      Math.max(0, cropY),
      Math.max(1, cropW),
      Math.max(1, cropH),
      0,
      0,
      Math.max(1, cropW),
      Math.max(1, cropH)
    );

    const dataURL = off.toDataURL("image/png");

    fabric.Image.fromURL(
      dataURL,
      (cropped) => {
        cropped.set({
          left: cropRect.left + cropRect.width / 2,
          top: cropRect.top + cropRect.height / 2,
          originX: "center",
          originY: "center",
          scaleX: image.scaleX,
          scaleY: image.scaleY,
          angle: image.angle,
          selectable: true,
          erasable: true,
          id: `image-${Date.now()}`,
          name: "Cropped Image",
        });

        // keep filters
        if (image.filters?.length) {
          cropped.filters = [...image.filters];
          cropped.applyFilters();
        }

        // cleanup crop UI
        canvas.remove(image);
        canvas.remove(cropRect);
        cropRectRef.current = null;
        cropTargetRef.current = null;

        canvas.selection = true;
        canvas.defaultCursor = "default";
        canvas.forEachObject((obj) => {
          obj.selectable = true;
          obj.evented = true;
        });

        canvas.off("mouse:down", handleCropMouseDown);
        canvas.off("mouse:move", handleCropMouseMove);
        canvas.off("mouse:up", handleCropMouseUp);

        setActiveTool(null);

        canvas.add(cropped);
        canvas.setActiveObject(cropped);
        canvas.requestRenderAll();
        saveCanvasState(canvas);
        persistCanvas(canvas);
      },
      { crossOrigin: "anonymous" }
    );
  };

  const cancelCrop = () => {
    if (!canvas) return;
    setActiveTool(null);
    canvas.selection = true;
    canvas.defaultCursor = "default";
    canvas.forEachObject((obj) => {
      obj.selectable = true;
      obj.evented = true;
    });
    if (cropRectRef.current) {
      canvas.remove(cropRectRef.current);
      cropRectRef.current = null;
    }
    cropTargetRef.current = null;
    canvas.off("mouse:down", handleCropMouseDown);
    canvas.off("mouse:move", handleCropMouseMove);
    canvas.off("mouse:up", handleCropMouseUp);
    canvas.requestRenderAll();
  };

  // ===== download trimmed =====
  const downloadImage = () => {
    if (!canvas) return;

    const tempImg = new Image();
    tempImg.crossOrigin = "anonymous";
    tempImg.src = canvas.toDataURL({ format: "png" });

    tempImg.onload = () => {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.drawImage(tempImg, 0, 0);

      const { data, width, height } = tempCtx.getImageData(
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
      );
      let minX = width,
        minY = height,
        maxX = 0,
        maxY = 0;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const alpha = data[(y * width + x) * 4 + 3];
          if (alpha > 0) {
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          }
        }
      }

      const outW = Math.max(1, maxX - minX + 1);
      const outH = Math.max(1, maxY - minY + 1);
      const trimmed = document.createElement("canvas");
      trimmed.width = outW;
      trimmed.height = outH;
      const tctx = trimmed.getContext("2d");
      tctx.drawImage(tempImg, minX, minY, outW, outH, 0, 0, outW, outH);

      const dataURL = trimmed.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `edited-image-${Date.now()}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  };

  // ===== sidebars & buttons =====
  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (buttonName) => {
    setActiveButton((prev) => (prev === buttonName ? null : buttonName));
    if (activeTool === "erase") stopErasing();
    if (buttonName === "Background") setActiveTool(null);
  };

  const handleColorClick = (color) => {
    if (!canvas) return;

    const active = canvas.getActiveObject();
    if (active && active.set) {
      active.set("fill", color);
    } else if (canvas.fillRect) {
      canvas.fillRect.set("fill", color);
    }

    canvas.renderAll();
    saveCanvasState(canvas);
    persistCanvas(canvas);
  };

  const directionToCoords = (direction) => {
    const map = {
      "to top": [0.5, 1, 0.5, 0],
      "to bottom": [0.5, 0, 0.5, 1],
      "to left": [1, 0.5, 0, 0.5],
      "to right": [0, 0.5, 1, 0.5],
      "to top left": [1, 1, 0, 0],
      "to top right": [0, 1, 1, 0],
      "to bottom left": [1, 0, 0, 1],
      "to bottom right": [0, 0, 1, 1],
    };

    if (map[direction]) return map[direction];

    const angle = parseFloat(direction);
    const rad = (angle * Math.PI) / 180;
    const x1 = 0.5 - 0.5 * Math.cos(rad);
    const y1 = 0.5 + 0.5 * Math.sin(rad);
    const x2 = 0.5 + 0.5 * Math.cos(rad);
    const y2 = 0.5 - 0.5 * Math.sin(rad);
    return [x1, y1, x2, y2];
  };

  const handleGradientClick = ({ colors, direction }) => {
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;

    const [x1, y1, x2, y2] = directionToCoords(direction).map((val, i) =>
      i % 2 === 0 ? val * width : val * height
    );

    const gradient = new fabric.Gradient({
      type: "linear",
      gradientUnits: "pixels",
      coords: { x1, y1, x2, y2 },
      colorStops: [
        { offset: 0, color: colors[0] },
        { offset: 1, color: colors[1] },
      ],
    });

    const activeObj = canvas.getActiveObject();
    if (activeObj) {
      activeObj.set("fill", gradient);
      canvas.requestRenderAll();
    } else {
      canvas.setBackgroundColor(gradient, () => canvas.renderAll());
    }
    saveCanvasState(canvas);
    persistCanvas(canvas);
  };

  const toolbarButtons = [
    {
      name: "Replace",
      icon: <Replace />,
      extra: (
        <input
          type="file"
          ref={fileInputRef}
          id="f2"
          onChange={handleReplaceImage}
          style={{ display: "none" }}
          accept="image/png,image/jpg,image/jpeg"
        />
      ),
    },
    { name: "Delete", icon: <Delete />, onClick: deleteSelected },
    {
      name: activeTool === "crop" ? "Apply Crop" : "Crop",
      icon: <Crop />,
      onClick: activeTool === "crop" ? applyCrop : startCropping,
      className: activeTool === "crop" ? "active" : "",
    },
    {
      name: isRemovingBg ? "Processing..." : "BG Remover",
      icon: <BgRemove />,
      onClick: async () => {
        if (!canvas || !canvas.getActiveObject()) {
          toast.error("Please select an image to remove background");
          return;
        }
        const activeObject = canvas.getActiveObject();
        if (!(activeObject instanceof fabric.Image)) {
          toast.error("Please select an image to remove background");
          return;
        }
        try {
          setIsRemovingBg(true);
          const imageSrc = activeObject.getSrc();
          const blob = await imglyBackgroundRemoval.removeBackground(imageSrc);
          const processedUrl = URL.createObjectURL(blob);

          fabric.Image.fromURL(processedUrl, (img) => {
            img.set({
              left: activeObject.left,
              top: activeObject.top,
              scaleX: activeObject.scaleX,
              scaleY: activeObject.scaleY,
              angle: activeObject.angle,
              originX: activeObject.originX,
              originY: activeObject.originY,
              flipX: activeObject.flipX,
              flipY: activeObject.flipY,
              skewX: activeObject.skewX,
              skewY: activeObject.skewY,
              opacity: activeObject.opacity,
              shadow: activeObject.shadow,
              selectable: true,
              erasable: true,
              id: `image-${Date.now()}`,
              name: "BG Removed Image",
            });
            if (activeObject.filters?.length) {
              img.filters = [...activeObject.filters];
              img.applyFilters();
            }
            canvas.remove(activeObject);
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
            saveCanvasState(canvas);
            persistCanvas(canvas);
            URL.revokeObjectURL(processedUrl);
          });
        } catch (err) {
          console.error(err);
          toast.error("Background removal failed. Please try again.");
        } finally {
          setIsRemovingBg(false);
        }
      },
      disabled: isRemovingBg,
    },
    {
      name: "Fill",
      icon: <Fill />,
      onClick: () => {
        setActiveTool("fill");
        setActiveButton("Background");
      },
    },
    {
      name: "Opacity",
      icon: <Opacity />,
      onClick: () => setActiveTool(activeTool === "opacity" ? null : "opacity"),
      className: activeTool === "opacity" ? "active" : "",
    },
    {
      name: "Contrast",
      icon: <Contrast />,
      onClick: () =>
        setActiveTool(activeTool === "contrast" ? null : "contrast"),
      className: activeTool === "contrast" ? "active" : "",
    },
    {
      name: "Blur",
      icon: <Blur />,
      onClick: () => setActiveTool(activeTool === "blur" ? null : "blur"),
      className: activeTool === "blur" ? "active" : "",
    },
    {
      name: activeTool === "erase" ? "Stop" : "Erase",
      icon: <Erase />,
      onClick: activeTool === "erase" ? stopErasing : startErasing,
      className: activeTool === "erase" ? "active" : "",
    },
    ...(activeTool === "crop"
      ? [
          {
            name: "Cancel Crop",
            icon: <Undo />,
            onClick: cancelCrop,
          },
        ]
      : []),
  ];

  const toolbarTextButtons = [
    {
      name: "English",
      onClick: () => {
        const text = new fabric.IText("Type here...", {
          left: 100,
          top: 100,
          fontFamily: "Arial",
          fontSize: 24,
          textAlign: "left",
          fill: "#000",
          direction: "ltr",
          id: `text-${Date.now()}`,
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.requestRenderAll();
        saveCanvasState(canvas);
        setActiveTool("English");
      },
      icon: <EN />,
    },
    {
      name: "Arabic",
      onClick: () => {
        const text = new fabric.IText("اكتب هنا...", {
          left: 100,
          top: 100,
          fontFamily: "Arial",
          fontSize: 24,
          textAlign: "right",
          fill: "#000",
          direction: "rtl",
          id: `text-${Date.now()}`,
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.requestRenderAll();
        saveCanvasState(canvas);
        setActiveTool("Arabic");
      },
      icon: <AR />,
    },
    {
      name: "Colors",
      onClick: () => setActiveTool("Colors"),
      icon: <Colors />,
    },
    {
      name: "Shadow",
      onClick: () =>
        activeTool === "Shadow" ? setActiveTool(null) : setActiveTool("Shadow"),
      icon: <Shadow />,
    },
    {
      name: "Duplicate",
      onClick: () => {
        const activeObject = canvas?.getActiveObject();
        if (activeObject) {
          activeObject.clone((cloned) => {
            cloned.set({
              left: activeObject.left + 10,
              top: activeObject.top + 10,
              evented: true,
            });
            if (cloned.canvas) cloned.canvas = null;
            canvas.add(cloned);
            canvas.setActiveObject(cloned);
            canvas.requestRenderAll();
            saveCanvasState(canvas);
            persistCanvas(canvas);
          });
        } else {
          toast.error("Please select object to duplicate");
        }
      },
      icon: <Duplicate />,
    },
    { name: "Delete", onClick: deleteSelected, icon: <Delete /> },
  ];

  const shadowXRef = useRef(5);
  const shadowYRef = useRef(5);

  const buttons = [
    { name: "Background", icon: <BG />, hasFill: true },
    { name: "Image Generator", icon: <ImageGenerator />, hasFill: true },
    { name: "Text", icon: <Text />, hasFill: true },
    { name: "Stickers", icon: <Stickers />, hasFill: false },
    { name: "TextArt", icon: <TextArt />, hasFill: false },
    { name: "Photo", icon: <Photo />, hasFill: false },
    { name: "Album", icon: <Album />, hasFill: false },
  ];

  return (
    <div
      className={
        active ? "dashborad editorPage active" : "dashborad editorPage"
      }
    >
      <Aside />
      <div className="editor">
        <DashboardNav
          handleActive={handleActive}
          handleSearch={handleSearch}
          type={2}
          downloadImage={downloadImage}
        />
        <div className="editorBody">
          <div className="sideTools">
            <div className="mainSide">
              {buttons.map((button) => (
                <button
                  key={button.name}
                  className={`${button.hasFill ? "fill" : ""} ${
                    activeButton === button.name ? "active" : ""
                  }`}
                  onClick={() => handleButtonClick(button.name)}
                >
                  <div className="svg">{button.icon}</div>
                  {button.name}
                </button>
              ))}
            </div>

            {activeButton === "Background" && activeTool === null && (
              <BackroundSide
                fileInputRef={fileInputRef}
                handleFileUpload={handleFileUpload}
              />
            )}

            {activeButton === "Background" && activeTool === "fill" && (
              <BackroundSideFill
                fileInputRef={fileInputRef}
                handleFileUpload={handleFileUpload}
                handleColorClick={handleColorClick}
                handleGradientClick={handleGradientClick}
              />
            )}

            {activeTool === "English" && <EnFonts />}
            {activeTool === "Arabic" && <ArFonts />}
            {activeTool === "Colors" && (
              <TextColors
                handleColorClick={handleColorClick}
                handleGradientClick={handleGradientClick}
              />
            )}
          </div>

          <div className="image-editor">
            <div className="mainTools">
              <div className="tools">
                <div className="toolbar">
                  {activeButton === "Text" ? (
                    <>
                      {toolbarTextButtons.map((button, index) => (
                        <button
                          key={index}
                          onClick={button?.onClick}
                          className={button.name === activeTool ? "active" : ""}
                          disabled={button.disabled}
                        >
                          {button?.icon}
                          {button.name}
                        </button>
                      ))}
                    </>
                  ) : (
                    toolbarButtons.map((button, index) => (
                      <div
                        key={index}
                        className={
                          button.name === "Fill" ? "color-picker-container" : ""
                        }
                      >
                        {button.name === "Replace" ? (
                          <label
                            htmlFor="f2"
                            className={button.className}
                            disabled={button.disabled}
                          >
                            {button.icon}
                            {button.name}
                          </label>
                        ) : (
                          <button
                            onClick={button?.onClick}
                            className={button.className}
                            disabled={button.disabled}
                          >
                            {button.icon}
                            {button.name}
                          </button>
                        )}
                        {button.extra}
                      </div>
                    ))
                  )}
                </div>

                {/* Undo/Redo */}
                <div className="redoundo">
                  <button onClick={undo} disabled={historyIndex.current <= 0}>
                    <Undo />
                  </button>
                  <button
                    onClick={redo}
                    disabled={
                      historyIndex.current >= history.current.length - 1
                    }
                  >
                    <Redo />
                  </button>
                </div>

                {/* Filters panel */}
                {(activeTool === "opacity" ||
                  activeTool === "blur" ||
                  activeTool === "contrast") && (
                  <div className="filter-control">
                    <div className="tandv">
                      <span>{activeTool}</span>
                      <span>{filterValue}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filterValue}
                      onChange={(e) => setFilterValue(Number(e.target.value))}
                    />
                    <button
                      className="btn btnsmall"
                      onClick={() => applyFilter(activeTool)}
                    >
                      Apply
                    </button>
                  </div>
                )}

                {/* Shadow panel */}
                {activeTool === "Shadow" && (
                  <form
                    className="filter-control"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const obj = canvas.getActiveObject();
                      if (obj) {
                        obj.set("shadow", {
                          color: "rgba(0,0,0,0.3)",
                          offsetX: parseInt(shadowXRef.current.value || 0, 10),
                          offsetY: parseInt(shadowYRef.current.value || 0, 10),
                        });
                        canvas.requestRenderAll();
                        saveCanvasState(canvas);
                        persistCanvas(canvas);
                        setActiveTool(null);
                      } else {
                        toast.error("Please select object first");
                      }
                    }}
                  >
                    <div className="tandv">
                      <span>Shadow X</span>
                      <span className="shadowXValue">5px</span>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        defaultValue="5"
                        ref={shadowXRef}
                        onInput={(e) => {
                          const el = document.querySelector(".shadowXValue");
                          if (el) el.textContent = `${e.target.value}px`;
                        }}
                      />
                    </div>

                    <div className="tandv">
                      <span>Shadow Y</span>
                      <span className="shadowYValue">5px</span>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        defaultValue="5"
                        ref={shadowYRef}
                        onInput={(e) => {
                          const el = document.querySelector(".shadowYValue");
                          if (el) el.textContent = `${e.target.value}px`;
                        }}
                      />
                    </div>

                    <button type="submit" className="btn btnsmall">
                      Apply Shadow
                    </button>
                  </form>
                )}

                {/* Eraser panel */}
                {activeTool === "erase" && (
                  <div className="filter-control">
                    <div className="tandv">
                      <span>Brush Size</span>
                      <span>{eraserSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="150"
                      value={eraserSize}
                      onChange={(e) => setEraserSize(Number(e.target.value))}
                    />
                    <div className="tandv" style={{ marginTop: 10 }}>
                      <span>Mode</span>
                      <button
                        className="btn btnsmall"
                        onClick={() => setIsRestoreMode((v) => !v)}
                        title={
                          supportsFabricEraser
                            ? "Toggle Erase/Restore"
                            : "Restore needs Fabric v5"
                        }
                      >
                        {isRestoreMode ? "Restore" : "Erase"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="canvas-container">
                <canvas
                  className={isRemovingBg ? "isRemovingBg" : ""}
                  ref={canvasRef}
                />
              </div>
            </div>

            {/* Layers */}
            <div className="layersB">
              <button
                onClick={() => setShowLayersPanel(!showLayersPanel)}
                className={showLayersPanel ? "button active" : "button"}
              >
                <Layers />
                Layers
              </button>

              {showLayersPanel && (
                <div className="layers-panel">
                  <div className="layers-list">
                    {layers.map((layer, index) => (
                      <div
                        key={layer.id}
                        className="layer-img layer-item"
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData(
                            "text/plain",
                            index.toString()
                          );
                          e.currentTarget.style.opacity = "0.4";
                        }}
                        onDragEnd={(e) => {
                          e.currentTarget.style.opacity = "1";
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.add("drag-over");
                        }}
                        onDragLeave={(e) => {
                          e.currentTarget.classList.remove("drag-over");
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.remove("drag-over");

                          const fromIndex = parseInt(
                            e.dataTransfer.getData("text/plain"),
                            10
                          );
                          const toIndex = index;
                          if (fromIndex === toIndex) return;

                          const newLayers = [...layers];
                          const [movedLayer] = newLayers.splice(fromIndex, 1);
                          newLayers.splice(toIndex, 0, movedLayer);

                          setLayers(newLayers);
                          canvas.discardActiveObject();
                          newLayers
                            .slice()
                            .reverse()
                            .forEach((layerObj, idx) => {
                              canvas.moveTo(layerObj.object, idx);
                            });
                          canvas.requestRenderAll();
                          saveCanvasState(canvas);
                          persistCanvas(canvas);
                        }}
                      >
                        <img
                          src={layer.object.toDataURL({
                            format: "png",
                            quality: 0.5,
                          })}
                          alt={layer.name}
                          className={`layer-thumbnail ${
                            canvas.getActiveObject()?.id === layer.id
                              ? "active"
                              : ""
                          }`}
                          onClick={() => {
                            canvas.setActiveObject(layer.object);
                            canvas.requestRenderAll();
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <p>Note: Drag layers to reorder them</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editor;

// ===== Side components (كما هي مع تحسينات بسيطة) =====
function BackroundSide({ fileInputRef, handleFileUpload }) {
  return (
    <div className="showSide">
      <label className="btn btn2 btn3" htmlFor="file">
        Upload
      </label>
      <input
        type="file"
        hidden
        id="file"
        name="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: "none" }}
        accept="image/png,image/jpg,image/jpeg"
      />
      <div className="recent recent3">
        <p>Recent designs</p>
        <div className="recent-designs">
          <Link to={"##"}>
            <img src="/media/recent.png" alt="" />
          </Link>
          <Link to={"##"}>
            <img src="/media/recent.png" alt="" />
          </Link>
          <Link to={"##"}>
            <img src="/media/recent.png" alt="" />
          </Link>
          <Link to={"##"}>
            <img src="/media/recent.png" alt="" />
          </Link>
        </div>
      </div>
      <div className="recent recent3">
        <p>Recommended designs </p>
        <div className="recent-designs">
          <Link to={"##"}>
            <img src="/media/recent.png" alt="" />
          </Link>
          <Link to={"##"}>
            <img src="/media/recent.png" alt="" />
          </Link>
          <Link to={"##"}>
            <img src="/media/recent.png" alt="" />
          </Link>
          <Link to={"##"}>
            <img src="/media/recent.png" alt="" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function BackroundSideFill({
  fileInputRef,
  handleFileUpload,
  handleColorClick,
  handleGradientClick,
}) {
  const gradients = [
    { colors: ["#218293", "#03464c"], direction: "to bottom left" },
    { colors: ["#218293", "#03464c"], direction: "145deg" },
    { colors: ["#218293", "#03464c"], direction: "to left" },
    { colors: ["#ff0099", "#ff6600"], direction: "to top right" },
    { colors: ["#1abc9c", "#16a085"], direction: "90deg" },
    { colors: ["#000", "#fff"], direction: "to left" },
  ];

  return (
    <div className="showSide">
      <label className="btn btn2 btn3" htmlFor="file">
        Upload
      </label>
      <input
        type="file"
        hidden
        id="file"
        name="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: "none" }}
        accept="image/png,image/jpg,image/jpeg"
      />
      <div className="colors">
        <div className="colorInner">
          <p>
            <Color />
            Colors
          </p>
          <div className="cols">
            {[
              "#ff0099",
              "#34b3f1",
              "#f39c12",
              "#9b59b6",
              "#2ecc71",
              "#e74c3c",
              "#1abc9c",
              "#34495e",
              "#ffcc00",
              "#e67e22",
            ].map((color, index) => (
              <span
                key={index}
                style={{ backgroundColor: color }}
                onClick={() => handleColorClick(color)}
              ></span>
            ))}
          </div>
        </div>
        <div className="colorInner">
          <p>
            <Gradiants />
            Gradiants
          </p>
          <div className="cols">
            <div className="cols">
              {gradients.map((g, index) => (
                <span
                  key={index}
                  style={{
                    backgroundImage: `linear-gradient(${g.direction}, ${g.colors[0]}, ${g.colors[1]})`,
                  }}
                  onClick={() => handleGradientClick(g)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EnFonts() {
  return (
    <div className="showSide">
      <h3>English fonts</h3>
      <div className="textcat">
        <h4>Category name</h4>
        <div className="textbtns">
          <button>Font name</button>
          <button>Font name</button>
          <button>
            Font name <FontLock />
          </button>
          <button>
            Font name <FontLock />
          </button>
        </div>
      </div>
      <div className="textcat">
        <h4>Category name</h4>
        <div className="textbtns">
          <button>Font name</button>
          <button>Font name</button>
          <button>
            Font name <FontLock />
          </button>
          <button>
            Font name <FontLock />
          </button>
        </div>
      </div>
    </div>
  );
}

function ArFonts() {
  return (
    <div className="showSide">
      <h3>Arabic fonts</h3>
      <div className="textcat ar">
        <h4>نوع الخط</h4>
        <div className="textbtns ar">
          <button>اسم الخط</button>
          <button>اسم الخط</button>
          <button>
            اسم الخط <FontLock />
          </button>
          <button>
            اسم الخط <FontLock />
          </button>
        </div>
      </div>
      <div className="textcat ar">
        <h4>نوع الخط</h4>
        <div className="textbtns ar">
          <button>اسم الخط</button>
          <button>اسم الخط</button>
          <button>
            اسم الخط <FontLock />
          </button>
          <button>
            اسم الخط <FontLock />
          </button>
        </div>
      </div>
    </div>
  );
}

function TextColors({ handleColorClick, handleGradientClick }) {
  const gradients = [
    { colors: ["#218293", "#03464c"], direction: "to bottom left" },
    { colors: ["#218293", "#03464c"], direction: "145deg" },
    { colors: ["#218293", "#03464c"], direction: "to left" },
    { colors: ["#ff0099", "#ff6600"], direction: "to top right" },
    { colors: ["#1abc9c", "#16a085"], direction: "90deg" },
    { colors: ["#000", "#fff"], direction: "to left" },
  ];

  return (
    <div className="showSide">
      <div className="colors">
        <div className="colorInner">
          <p>
            <Color />
            Colors
          </p>
          <div className="cols">
            {[
              "#ff0099",
              "#34b3f1",
              "#f39c12",
              "#9b59b6",
              "#2ecc71",
              "#e74c3c",
              "#1abc9c",
              "#34495e",
              "#ffcc00",
              "#e67e22",
            ].map((color, index) => (
              <span
                key={index}
                style={{ backgroundColor: color }}
                onClick={() => handleColorClick(color)}
              ></span>
            ))}
          </div>
        </div>
        <div className="colorInner">
          <p>
            <Gradiants />
            Gradiants
          </p>
          <div className="cols">
            <div className="cols">
              {gradients.map((g, index) => (
                <span
                  key={index}
                  style={{
                    backgroundImage: `linear-gradient(${g.direction}, ${g.colors[0]}, ${g.colors[1]})`,
                  }}
                  onClick={() => handleGradientClick(g)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
