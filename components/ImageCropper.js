import Cropper from 'react-easy-crop'
import { useCallback, useRef, useState } from 'react'
import getCroppedImg from '../utils/CropImage'
import * as Slider from '@radix-ui/react-slider'
import styles from '../styles/Components.module.css'

export const ImageCropper = ({ currentSrc, updateFile}) => {
  const hiddenFileInput = useRef(null)
  const [src, setSrc] = useState(currentSrc)
  const [filename, setFilename] = useState('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const handleClick = () => {
    hiddenFileInput.current.click()
  }

  const handleChange = (event) => {
    const src = URL.createObjectURL(event.target.files[0])
    setSrc(src)
    setFilename(event.target.files[0].name)
  }

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        src,
        croppedAreaPixels,
        rotation,
        filename
      )
      updateFile(croppedImage)
    } catch (error) {
      console.log(error)
    }
  }, [croppedAreaPixels, rotation, filename, src, updateFile])

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
    showCroppedImage()
  }, [showCroppedImage])

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
      <input type='file' accept='image/*' ref={hiddenFileInput} onChange={handleChange} style={{display: 'none'}} />
      <div style={{position: 'relative', width: 300, height: 300}}>
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          maxZoom={10}
          aspect={1}
          cropShape={'round'}
          showGrid={false}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          objectFit='vertical-cover'
        />
      </div>
      <div style={{display: 'flex', gap: 15}}>
        <span>Rotation</span>
        <Slider.Root className={styles.SliderRoot} defaultValue={[0]} max={360} step={1} onValueChange={setRotation}>
          <Slider.Track className={styles.SliderTrack}>
            <Slider.Range className={styles.SliderRange} />
          </Slider.Track>
          <Slider.Thumb className={styles.SliderThumb} />
        </Slider.Root>
      </div>
      <div style={{display: 'flex', gap: 15}}>
        <span>Zoom</span>
        <Slider.Root className={styles.SliderRoot} defaultValue={[1]} min={1} max={10} step={0.05} onValueChange={setZoom}>
          <Slider.Track className={styles.SliderTrack}>
            <Slider.Range className={styles.SliderRange} />
          </Slider.Track>
          <Slider.Thumb className={styles.SliderThumb} />
        </Slider.Root>
      </div>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <button className="transparent" onClick={handleClick}>
          Upload Image
        </button>
      </div>
    </div>
  )
}

export default ImageCropper