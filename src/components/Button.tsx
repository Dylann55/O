import clsx from 'clsx';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  href?: string;
}

export function Button({ className, href, ...props }: ButtonProps) {
  const fullClassName = clsx(className);

  if (href) {
    return <Link href={href} className={fullClassName}></Link>;
  }

  return <button className={fullClassName} {...props} />;
}
