import { useEffect, useState } from "react";

const ProgressiveImg = ({ placeholder, attachment }) => {
  const [imgSrc, setImgSrc] = useState(placeholder)

  useEffect(() => {
    const newImg = new Image();
    newImg.src = attachment.src;
    newImg.onload = () => {
      setImgSrc(newImg.src)
    };
  }, [attachment])
  

  return(
    <img
      src={imgSrc}
      className="progressiveImg"
      width={attachment.width}
      height={attachment.height}
      alt=""
    />
  )
}

export default ProgressiveImg