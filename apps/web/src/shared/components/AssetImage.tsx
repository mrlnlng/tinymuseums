import { pictureSources, type AssetName } from '@/shared/lib/assets'

type ImgProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'>

export default function AssetImage({ name, alt = '', ...props }: { name: AssetName } & ImgProps) {
  const { src, srcSet, avifSrcSet } = pictureSources(name)
  return (
    <picture>
      {avifSrcSet ? <source srcSet={avifSrcSet} type="image/avif" /> : null}
      <img src={src} srcSet={srcSet} alt={alt} {...props} />
    </picture>
  )
}
