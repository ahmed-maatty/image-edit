import { useState } from "react";

function ImageGenerator() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization":
        },
        body: JSON.stringify({ inputs: prompt }),
      });

      console.log(response);
      

      const blob = await response.blob();
      const imgUrl = URL.createObjectURL(blob);
      setImage(imgUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Image Generator (via Hugging Face)</h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your image..."
          style={{
            width: "70%",
            padding: "10px",
            fontSize: "16px",
            marginRight: "10px",
          }}
          disabled={loading}
        />
        <button
          onClick={generateImage}
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: loading ? "#cccccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "wait" : "pointer",
            fontSize: "16px",
          }}
        >
          {loading ? "Generating..." : "Generate Image"}
        </button>
      </div>

      {image && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <img
            src={image}
            alt="Generated"
            style={{
              maxWidth: "100%",
              maxHeight: "512px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          />
          <div style={{ marginTop: "10px" }}>
            <a
              href={image}
              download={`generated-${Date.now()}.png`}
              style={{
                padding: "8px 16px",
                backgroundColor: "#2196F3",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              Download Image
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageGenerator;
