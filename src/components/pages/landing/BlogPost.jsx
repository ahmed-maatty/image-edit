import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AxiosInstance } from "../../../api/axios";
import { handleError } from "../../../api/error";

function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await AxiosInstance.get(`/blog/${slug}`);
        setBlog(res?.data?.data);
      } catch (error) {
        handleError(error);
      }
    };
    fetchData();
  }, []);
  console.log(blog);
  return (
    <>
      <img
        src="/media/imgs/Ellipse 4.png"
        alt=""
        className="ellipse1"
        style={{ opacity: 1 }}
      />
      <img
        src="/media/imgs/Ellipse 4.png"
        alt=""
        className="ellipse2"
        style={{ opacity: 1 }}
      />
      <img
        src="/media/imgs/Ellipse 4.png"
        alt=""
        className="ellipse3"
        style={{ opacity: 1 }}
      />
      <div className="hero">
        <div className="box">
          <div className="bx blog_post_hero_bx">
            <div>
              <h1 className="blog_post_title">{blog?.title}</h1>
              <p className="learnTutorial">{blog?.meta_description}</p>
            </div>
            <div>
              <img
                className="heroImg blog_post_img"
                src={blog?.image}
                alt=""
              />
            </div>
          </div>
        </div>
        <img className="bg" src="/media/imgs/Hero.png" alt="" />
      </div>
      <section className="blog_post_section">
        <div className="box">
          <div className="blog_post_container">
            <p className="blog_post_text">
             {blog?.body}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default BlogPost;
