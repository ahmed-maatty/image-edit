import Aside from "../fragments/dashboard/Aside";
import { useDashboardNav } from "../../hooks/DashboardNavHook";
import { DashboardNav } from "../fragments/dashboard/DashboardNav";
import AlsoLinks from "../fragments/ai/AlsoLinks";
import { useRef, useState } from "react";

const styles = [
  { en: "Standard", ar: "عادي", value: "standard" },
  { en: "Portrait", ar: "بورتريه", value: "portrait" },
  { en: "3D", ar: "ثلاثي الأبعاد", value: "3d" },
  { en: "Digital art", ar: "فن رقمي", value: "digital art" },
  { en: "Natural landscape", ar: "مناظر طبيعية", value: "natural landscape" },
];

function UpScale() {
  const { active, handleActive, handleSearch } = useDashboardNav();
  const inputRef = useRef(null);
  const [type, setType] = useState(styles[0].value);
  const [textInput, setTextInput] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [resultImages, setResultImages] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const handleType = (event) => {
    const selectedType = event.target.dataset.type;
    setType(selectedType);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setResultImages([]);
    }
  };

  const handleUpscale = () => {
    const result2 = "/media/banner.png";
    setResultImages([uploadedImage, result2]);
    setDisabled(true);
    setTextInput("");
  };

  const handleDownload = (event) => {
    const url = event.target.src;
    const filename = url.split("/").pop();
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={active ? "dashborad active" : "dashborad"}>
      <Aside type={2} />
      <div className="container dashb">
        <DashboardNav handleActive={handleActive} handleSearch={handleSearch} />
        <div className="content">
          <div className="igContent">
            <AlsoLinks />
            <div className="otherContent">
              {!uploadedImage && (
                <div className="flexcenter50">
                  <div className="generateInput imgInput">
                    <h1>
                      AI-Powered Image <br /> Quality Boost
                    </h1>
                    <div className="input">
                      <label
                        htmlFor="img"
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          const file = e.dataTransfer.files[0];
                          if (file && file.type.startsWith("image/")) {
                            const dataTransfer = new DataTransfer();
                            dataTransfer.items.add(file);
                            inputRef.current.files = dataTransfer.files;
                            handleFileChange({ target: inputRef.current });
                          }
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => e.preventDefault()}
                      >
                        <h4>Drag and drop image here</h4>
                        <span>JPG, PNG / Max. 8 MB / Min. 224px x 224px</span>
                      </label>
                      <input
                        type="file"
                        name="img"
                        id="img"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        ref={inputRef}
                      />
                    </div>

                    <p className="noteForIG">
                      Upload your image, choose your upscale level, and let our
                      AI enhance the quality—sharper, cleaner, and
                      high-resolution in seconds.
                    </p>
                    <h4 className="fw500">Image style</h4>
                    <StylesList
                      styles={styles}
                      handleType={handleType}
                      type={type}
                    />
                  </div>
                  <img src="/media/up.png" alt="" />
                </div>
              )}

              {uploadedImage && (
                <div className="flexcenter50">
                  <div className="generateInput imgInput upinput">
                    <h3>
                      AI-Powered Image <br /> Quality Boost
                    </h3>
                    <h4 className="fw500 pt15">Image style</h4>
                    <StylesList
                      styles={styles}
                      handleType={handleType}
                      type={type}
                    />
                    <div className="input">
                      <div className="field">
                        <textarea
                          name="text"
                          placeholder="Describe your image for better results"
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                          disabled={disabled}
                        />
                      </div>
                    </div>
                    <div className="styleAndGen">
                      <button
                        className="btn btn2 btn3"
                        onClick={handleUpscale}
                        disabled={disabled}
                      >
                        <UpscaleIcon />
                        Upscale
                      </button>
                    </div>
                  </div>

                  <div className="rimages">
                    <div className="uplodedImage linearBorder">
                      <img src={uploadedImage} alt="Uploaded" />
                    </div>

                    {resultImages.length > 0 && (
                      <div className="rs">
                        {resultImages.map((img, index) => (
                          <div
                            key={index}
                            className="uplodedImage uplodedImage2 linearBorder"
                            onClick={() => {
                              setUploadedImage(img);
                            }}
                          >
                            <img src={img} alt={`Result ${index + 1}`} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="recent recent2">
                <h3 className="seeAll pb20">Your latest edits</h3>
                <div className="recent-generates">
                  <div className="gsimgs">
                    {[...Array(8)].map((_, i) => (
                      <img
                        key={i}
                        src="/media/recent.png"
                        alt=""
                        onClick={handleDownload}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UpScale;

function StylesList({ styles, handleType, type }) {
  return (
    <ul className="imgStyle">
      {styles.map((item) => (
        <li
          key={item.value}
          data-type={item.value}
          onClick={handleType}
          className={type === item.value ? "active" : ""}
        >
          {item.en}
        </li>
      ))}
    </ul>
  );
}

function UpscaleIcon() {
  return (
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.5 3H21.5M21.5 3V8M21.5 3L16.5 8M17.5 21H19.5C20.0304 21 20.5391 20.7893 20.9142 20.4142C21.2893 20.0391 21.5 19.5304 21.5 19M21.5 12V15M3.5 7V5C3.5 4.46957 3.71071 3.96086 4.08579 3.58579C4.46086 3.21071 4.96957 3 5.5 3M5.5 21L9.644 16.856C9.75637 16.7435 9.88981 16.6543 10.0367 16.5934C10.1836 16.5325 10.341 16.5012 10.5 16.5012C10.659 16.5012 10.8164 16.5325 10.9633 16.5934C11.1102 16.6543 11.2436 16.7435 11.356 16.856L13.5 19M9.5 3H12.5"
        stroke="#3E3C37"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 11H4.5C3.94772 11 3.5 11.4477 3.5 12V20C3.5 20.5523 3.94772 21 4.5 21H12.5C13.0523 21 13.5 20.5523 13.5 20V12C13.5 11.4477 13.0523 11 12.5 11Z"
        stroke="#3E3C37"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
