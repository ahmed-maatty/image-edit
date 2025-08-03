import { Link } from "react-router-dom";
import Aside from "../fragments/dashboard/Aside";
import { useDashboardNav } from "../../hooks/DashboardNavHook";
import { DashboardNav } from "../fragments/dashboard/DashboardNav";
import { useRef, useEffect, useState } from "react";
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
import { AxiosBG } from "../../api/axios";

function Editor() {
  const { active, handleActive, handleSearch } = useDashboardNav();
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const [filterValue, setFilterValue] = useState(50);
  const [imageUrl, setImageUrl] = useState("");
  const [showLayersPanel, setShowLayersPanel] = useState(false);
  const [layers, setLayers] = useState([]);
  const fileInputRef = useRef(null);
  const history = useRef([]);
  const historyIndex = useRef(-1);

  useEffect(() => {
    setFilterValue(50);
  }, [activeTool]);
  useEffect(() => {
    const canvasObj = new fabric.Canvas(canvasRef.current, {
      width: 600,
      height: 500,
      backgroundColor: "#f5f5f5",
      isDrawingMode: false, // Initially false
      preserveObjectStacking: true, // Important for eraser
    });
    setCanvas(canvasObj);

    // Save initial state
    saveCanvasState(canvasObj);

    return () => {
      canvasObj.dispose();
    };
  }, []);

  // Update layers when canvas objects change
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
        id: obj.id || `layer-${Date.now()}-${index}`,
        name: obj.name || `Layer ${filtered.length - index}`,
        visible: obj.visible !== false,
        object: obj,
        index: index,
      }));

      setLayers(newLayers.reverse()); // Top layer first
    };

    const onPathCreated = () => {
      saveCanvasState(canvas);
    };

    const cleanEmptyGroups = (e) => {
      const obj = e.target;
      if (
        obj?.type === "group" &&
        (!obj._objects || obj._objects.length === 0)
      ) {
        canvas.remove(obj);
        canvas.requestRenderAll();
      }
    };

    canvas.on("object:modified", cleanEmptyGroups);
    canvas.on("object:added", updateLayers);
    canvas.on("object:removed", updateLayers);
    canvas.on("object:modified", updateLayers);
    canvas.on("object:moved", updateLayers);
    canvas.on("path:created", onPathCreated);

    return () => {
      canvas.off("object:modified", cleanEmptyGroups);
      canvas.off("object:added", updateLayers);
      canvas.off("object:removed", updateLayers);
      canvas.off("object:modified", updateLayers);
      canvas.off("object:moved", updateLayers);
      canvas.off("path:created", onPathCreated);
    };
  }, [canvas]);

  const saveCanvasState = (canvas) => {
    const state = JSON.stringify(canvas);
    history.current = history.current.slice(0, historyIndex.current + 1);
    history.current.push(state);
    historyIndex.current = history.current.length - 1;
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

  const loadCanvasState = (state) => {
    canvas.loadFromJSON(state, () => {
      canvas.renderAll();
    });
  };

  // Load image when URL changes
  useEffect(() => {
    if (!canvas || !imageUrl) return;

    fabric.Image.fromURL(imageUrl, (img) => {
      // Scale image to fit canvas while maintaining aspect ratio
      const scale = Math.min(
        1,
        canvas.width / img.width,
        canvas.height / img.height
      );
      img.scale(scale);

      // Center the image
      img.set({
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: "center",
        originY: "center",
        selectable: true,
        erasable: true,
        id: `image-${Date.now()}`,
        name: "Background Image",
      });

      canvas.clear();
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
      saveCanvasState(canvas);
    });
  }, [canvas, imageUrl]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const cropRectRef = useRef(null);
  const isDrawing = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);

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
      fill: "rgba(0, 0, 0, 0.3)",
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
    const image = canvas.getObjects().find((obj) => obj.type === "image");

    if (!image) return;

    // Limit pointer to image bounds
    const imageBounds = {
      left: image.left - (image.width * image.scaleX) / 2,
      right: image.left + (image.width * image.scaleX) / 2,
      top: image.top - (image.height * image.scaleY) / 2,
      bottom: image.top + (image.height * image.scaleY) / 2,
    };

    const x = Math.max(
      imageBounds.left,
      Math.min(pointer.x, imageBounds.right)
    );
    const y = Math.max(
      imageBounds.top,
      Math.min(pointer.y, imageBounds.bottom)
    );

    const width = x - startX.current;
    const height = y - startY.current;

    cropRectRef.current.set({
      width: Math.abs(width),
      height: Math.abs(height),
      left: width < 0 ? x : startX.current,
      top: height < 0 ? y : startY.current,
    });

    canvas.renderAll();
  };

  const handleCropMouseUp = () => {
    isDrawing.current = false;
  };

  const applyCrop = () => {
    if (!canvas || activeTool !== "crop" || !cropRectRef.current) {
      toast.error("Please select an image first to crop");
      setActiveTool(null);
      return;
    }

    const image = canvas.getObjects().find((obj) => obj.type === "image");
    if (!image) {
      toast.error("Please select an image first to crop");
      setActiveTool(null);
      return;
    }

    const cropRect = cropRectRef.current;

    const originalWidth = image.width + (image.cropX || 0);
    const originalHeight = image.height + (image.cropY || 0);

    const imageLeft = image.left - (image.width * image.scaleX) / 2;
    const imageTop = image.top - (image.height * image.scaleY) / 2;

    const cropX =
      (cropRect.left - imageLeft) / image.scaleX + (image.cropX || 0);
    const cropY = (cropRect.top - imageTop) / image.scaleY + (image.cropY || 0);

    const cropWidth = Math.min(
      cropRect.width / image.scaleX,
      originalWidth - cropX
    );
    const cropHeight = Math.min(
      cropRect.height / image.scaleY,
      originalHeight - cropY
    );

    const cropped = new fabric.Image(image.getElement(), {
      left: cropRect.left + cropRect.width / 2,
      top: cropRect.top + cropRect.height / 2,
      originX: "center",
      originY: "center",
      scaleX: image.scaleX,
      scaleY: image.scaleY,
      angle: image.angle,
      cropX: cropX,
      cropY: cropY,
      width: cropWidth,
      height: cropHeight,
      selectable: true,
      evented: true,
      id: `image-${Date.now()}`,
      name: "Cropped Image",
    });

    canvas.remove(image);
    canvas.remove(cropRect);
    cropRectRef.current = null;
    isDrawing.current = false;

    canvas.selection = true;
    canvas.defaultCursor = "default";
    canvas.forEachObject((obj) => {
      obj.selectable = true;
      obj.evented = true;
    });

    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up");

    canvas.add(cropped);
    canvas.setActiveObject(cropped);
    canvas.requestRenderAll();

    setActiveTool(null);
    saveCanvasState(canvas);
  };

  const startCropping = () => {
    if (!canvas) return;

    canvas.off("mouse:down", handleCropMouseDown);
    canvas.off("mouse:move", handleCropMouseMove);
    canvas.off("mouse:up", handleCropMouseUp);

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

  const [isRemovingBg, setIsRemovingBg] = useState(false);

  const removeBackground = async () => {
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

        if (activeObject.clipPath) {
          img.clipPath = activeObject.clipPath;
        }

        img.set({
          width: activeObject.width,
          height: activeObject.height,
        });

        canvas.remove(activeObject);
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        saveCanvasState(canvas);

        URL.revokeObjectURL(processedUrl);
      });
    } catch (error) {
      console.error("Background removal failed:", error);
      toast.error("Background removal failed. Please try again.");
    } finally {
      setIsRemovingBg(false);
    }
  };

  const deleteSelected = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      saveCanvasState(canvas);
    } else {
      toast.error("Select object to delete");
    }
  };

  const startErasing = () => {
    if (!canvas) return;

    setActiveTool("erase");
    canvas.isDrawingMode = true;

    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.color = "#f5f5f5";
    canvas.freeDrawingBrush.width = 30;

    canvas.getObjects().forEach((obj) => {
      obj.set({ erasable: true });

      if (obj._objects) {
        obj._objects.forEach((subObj) => subObj.set({ erasable: true }));
      }
    });

    canvas.requestRenderAll();
  };

  const stopErasing = () => {
    if (!canvas) return;

    setActiveTool(null);
    canvas.isDrawingMode = false;
    canvas.renderAll();
  };

  const handleCanvasObjectModified = () => {
    saveCanvasState(canvas);
  };
  const downloadImage = () => {
    if (!canvas) return;

    // Create a temporary image to ensure the canvas is fully rendered
    const tempImg = new Image();
    tempImg.crossOrigin = "anonymous";
    tempImg.src = canvas.toDataURL("image/png");

    tempImg.onload = () => {
      // Create a temporary canvas to analyze the image
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.drawImage(tempImg, 0, 0);

      // Get the pixel data
      const pixels = tempCtx.getImageData(
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
      ).data;

      // Calculate the bounding box of non-transparent pixels
      let minX = tempCanvas.width,
        minY = tempCanvas.height,
        maxX = 0,
        maxY = 0;

      for (let y = 0; y < tempCanvas.height; y++) {
        for (let x = 0; x < tempCanvas.width; x++) {
          const alpha = pixels[(y * tempCanvas.width + x) * 4 + 3];
          if (alpha > 0) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }

      // Calculate width and height of the content
      const width = maxX - minX + 1;
      const height = maxY - minY + 1;

      // Create the final trimmed canvas
      const trimmedCanvas = document.createElement("canvas");
      trimmedCanvas.width = width;
      trimmedCanvas.height = height;
      const trimmedCtx = trimmedCanvas.getContext("2d");

      // Draw only the content area from the original image
      trimmedCtx.drawImage(
        tempImg,
        minX,
        minY,
        width,
        height, // source rectangle
        0,
        0,
        width,
        height // destination rectangle
      );

      // Export the trimmed canvas
      const dataURL = trimmedCanvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.download = `edited-image-${Date.now()}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    tempImg.onerror = () => {
      console.error("Error loading temporary image");
    };
  };

  const applyFilter = (filterType) => {
    if (!canvas || !canvas.getActiveObject()) {
      toast.error("Please select object first");
      return;
    }

    const activeObject = canvas.getActiveObject();

    activeObject.filters =
      activeObject.filters?.filter((f) => !f.type.includes(filterType)) || [];

    if (filterType === "blur") {
      activeObject.filters.push(
        new fabric.Image.filters.Blur({
          blur: filterValue / 100,
        })
      );
    } else if (filterType === "opacity") {
      activeObject.opacity = filterValue / 100;
    } else if (filterType === "contrast") {
      activeObject.filters.push(
        new fabric.Image.filters.Contrast({
          contrast: filterValue / 100,
        })
      );
    }

    activeObject.applyFilters();
    canvas.renderAll();
    saveCanvasState(canvas);
  };
  useEffect(() => {
    if (!canvas) return;

    canvas.on("object:modified", handleCanvasObjectModified);
    return () => {
      canvas.off("object:modified", handleCanvasObjectModified);
    };
  }, [canvas]);

  const handleReplaceImage = (e) => {
    const file = e.target.files[0];
    // if (!file || !canvas) return;

    const reader = new FileReader();
    reader.onload = (f) => {
      const dataUrl = f.target.result;

      const activeObject = canvas.getActiveObject();
      if (!activeObject || activeObject.type !== "image") {
        toast.error("Please select an image to replace.");
        return;
      }

      fabric.Image.fromURL(dataUrl, (newImg) => {
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
        });

        canvas.remove(activeObject);
        canvas.add(newImg);
        canvas.setActiveObject(newImg);
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
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
    {
      name: "Delete",
      icon: <Delete />,
      onClick: deleteSelected,
    },
    {
      name: activeTool === "crop" ? "Apply Crop" : "Crop",
      icon: <Crop />,
      onClick:
        activeTool === "crop"
          ? applyCrop
          : () => {
              setActiveTool("crop");
              startCropping();
            },
      className: activeTool === "crop" ? "active" : "",
    },
    {
      name: isRemovingBg ? "Processing..." : "BG Remover",
      icon: <BgRemove />,
      onClick: removeBackground,
      disabled: isRemovingBg,
    },
    {
      name: "Fill",
      icon: <Fill />,
      onClick: () => {
        setActiveTool("fill");
        setActiveButton("Background");
      },
      // extra: showColorPicker && (
      //   <div className="color-picker-popup">
      //     <ChromePicker
      //       color={selectedColor}
      //       onChangeComplete={(color) => {
      //         const { r, g, b, a } = color.rgb;
      //         setSelectedColor(`rgba(${r}, ${g}, ${b}, ${a})`);
      //       }}
      //     />
      //     <button className="btn smallBtn" onClick={fillWithColor}>
      //       Apply
      //     </button>
      //   </div>
      // ),
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
    // {
    //   name: "Resize",
    //   onClick: () => setActiveTool("Resize"),
    //   icon: <Resize />,
    // },
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
            if (cloned.canvas) cloned.canvas = null; // Detach from any previous canvas
            canvas.add(cloned);
            canvas.setActiveObject(cloned);
            canvas.requestRenderAll();
            saveCanvasState(canvas);
          });
        } else {
          toast.error("Please select object to duplicate");
        }
      },
      icon: <Duplicate />,
    },
    {
      name: "Delete",
      onClick: deleteSelected,
      icon: <Delete />,
    },
  ];
  const shadowXRef = useRef(5);
  const shadowYRef = useRef(5);

  const [activeButton, setActiveButton] = useState(null);

  const buttons = [
    { name: "Background", icon: <BG />, hasFill: true },
    { name: "Image Generator", icon: <ImageGenerator />, hasFill: true },
    { name: "Text", icon: <Text />, hasFill: true },
    { name: "Stickers", icon: <Stickers />, hasFill: false },
    { name: "TextArt", icon: <TextArt />, hasFill: false },
    { name: "Photo", icon: <Photo />, hasFill: false },
    { name: "Album", icon: <Album />, hasFill: false },
  ];

  const handleButtonClick = (buttonName) => {
    setActiveButton((prev) => (prev === buttonName ? null : buttonName));
    if (activeTool === "fill") {
      setActiveTool(null);
    }
    if (activeTool === "erase") {
      stopErasing();
    }
    if (buttonName === "Background") {
      setActiveTool(null);
    }

    // if (buttonName === "Text") {
    //   setActiveTool("English"); // Ensures default toolbar (not en/ar/color directly)
    // }
  };

  const handleColorClick = (color) => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set("fill", color);
      canvas.renderAll();
    } else {
      canvas.setBackgroundColor(color, () => canvas.renderAll());
    }
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

    const activeObject = canvas.getActiveObject();

    if (activeObject) {
      activeObject.set("fill", gradient);
      canvas.requestRenderAll();
    } else {
      canvas.setBackgroundColor(gradient, () => canvas.renderAll());
    }
  };

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
                  {activeButton === "Text" && (
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
                          {button.extra}
                        </button>
                      ))}
                    </>
                  )}

                  {activeButton !== "Text" &&
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
                    ))}
                </div>
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
                {activeTool === "opacity" ||
                activeTool === "blur" ||
                activeTool === "contrast" ? (
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
                      onChange={(e) => setFilterValue(e.target.value)}
                    />
                    <button
                      className="btn btnsmall"
                      onClick={() => applyFilter(activeTool)}
                    >
                      Apply
                    </button>
                  </div>
                ) : null}

                {activeTool === "Shadow" && (
                  <form
                    className="filter-control"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const obj = canvas.getActiveObject();
                      if (obj) {
                        obj.set("shadow", {
                          color: "rgba(0,0,0,0.3)",
                          // blur: 5,
                          offsetX: parseInt(shadowXRef.current.value || 0),
                          offsetY: parseInt(shadowYRef.current.value || 0),
                        });
                        canvas.requestRenderAll();
                        saveCanvasState(canvas);
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
              </div>
              <div className="canvas-container">
                <canvas
                  className={isRemovingBg ? "isRemovingBg" : ""}
                  ref={canvasRef}
                />
              </div>
            </div>
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
                        className="layer-img"
                        draggable
                        // onDoubleClick={() => {
                        //   layer.object.visible = !layer.object.visible;
                        //   canvas.requestRenderAll();
                        // }}
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", index);
                          e.currentTarget.style.opacity = "0.4"; // Visual feedback
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
                            e.dataTransfer.getData("text/plain")
                          );
                          const toIndex = index;

                          if (fromIndex === toIndex) return;

                          // Create new array without mutating state directly
                          const newLayers = [...layers];
                          const [movedLayer] = newLayers.splice(fromIndex, 1);
                          newLayers.splice(toIndex, 0, movedLayer);

                          // Update both state and canvas
                          setLayers(newLayers);

                          // Important: Update canvas z-index without removing objects
                          canvas.discardActiveObject();
                          newLayers.forEach((layerObj, idx) => {
                            canvas.moveTo(layerObj.object, idx);
                          });

                          canvas.requestRenderAll();
                          saveCanvasState(canvas);
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
        style={{
          display: "none",
        }}
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
        style={{
          display: "none",
        }}
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
