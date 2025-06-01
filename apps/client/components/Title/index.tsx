import { HTMLAttributes } from "react"

type Props = HTMLAttributes<HTMLHeadElement>

const Title: React.FC<Props> = ({ children, className, ...props }: Props) => {
    return <h1 className={`w-full font-gilroy-black text-4xl mb-20 leading-10 ${className}`}>{children}</h1>
}

export default Title
