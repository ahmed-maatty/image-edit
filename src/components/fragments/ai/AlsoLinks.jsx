import { Link, useLocation } from "react-router-dom";

function AlsoLinks() {
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { path: "/generate", img: "/media/d11.png" },
    { path: "/bg-remover", img: "/media/d22.png" },
    { path: "/up-scale", img: "/media/d33.png" },
  ];

  const filteredLinks = links.filter(link => link.path !== currentPath);

  if (filteredLinks.length === 0) return null; 

  return (
    <div className="also">
      <h3>Also you can check</h3>
      {filteredLinks.map(link => (
        <Link to={link.path} key={link.path}>
          <img src={link.img} alt="" />
        </Link>
      ))}
    </div>
  );
}

export default AlsoLinks;
