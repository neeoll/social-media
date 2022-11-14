import { useEffect, useState } from "react";

const ProgressiveImg = ({ placeholder, src }) => {
  const [imgSrc, setImgSrc] = useState(placeholder)
  const [dimensions, setDimensions] = useState({width: 0, height: 0})
  useEffect(() => {
    console.log(placeholder)
    const newImg = new Image();
    newImg.src = src;
    newImg.onload = () => {
      console.log(newImg)
      setImgSrc(newImg.src)
      setDimensions({width: newImg.width, height: newImg.height}) 
    };
  }, [src])
  

  return(
    <img
      src={imgSrc}
      className="progressiveImg"
      width={dimensions.width}
      height={dimensions.height}
      alt=""
    />
  )
}

export default ProgressiveImg