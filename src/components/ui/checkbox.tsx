import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, defaultChecked, onChange, onCheckedChange, id, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState<boolean>(
      Boolean(checked ?? defaultChecked ?? false)
    );

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(Boolean(checked));
      }
    }, [checked]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      if (checked === undefined) {
        setIsChecked(newChecked);
      }
      onChange?.(e);
      onCheckedChange?.(newChecked);
    };

    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          id={id}
          ref={ref}
          checked={isChecked}
          onChange={handleChange}
          className="peer sr-only"
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            "flex size-4.5 cursor-pointer items-center justify-center rounded-sm border border-zinc-300 bg-white transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-600/30 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900",
            isChecked && "border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-600",
            className
          )}
        >
          {isChecked && <Check className="size-3 stroke-[2.5]" />}
        </label>
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
