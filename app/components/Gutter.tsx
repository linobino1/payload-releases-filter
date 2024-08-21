import { cn } from "~/util/cn";

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  size?: "small" | "medium" | "large";
  disable?: boolean;
}

const Gutter: React.FC<Props> = ({
  as = "div",
  size = "medium",
  disable = false,
  className,
  ...props
}) => {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "w-full",
        !disable && "mx-auto",
        !disable &&
          size === "small" &&
          "max-w-[min(970px,94vw)] lg:max-w-[min(970px,90vw)]",
        !disable &&
          size === "medium" &&
          "max-w-[min(1280px,94vw)] lg:max-w-[min(1280px,90vw)]",
        !disable && size === "large" && "px-[5%]",
        className
      )}
    >
      {props.children}
    </Tag>
  );
};

export default Gutter;
