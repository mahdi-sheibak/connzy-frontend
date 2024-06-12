import React, {
  useRef,
  ComponentProps,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DropzoneProps extends Omit<ComponentProps<"input">, "onChange"> {
  onChange: (files: FileList | null) => void;
  message?: string;
}

interface DropzoneRef {
  focus: () => void;
}

export const Dropzone = forwardRef<DropzoneRef, DropzoneProps>(
  ({ onChange, message, className, ...props }, ref) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const dropzoneRef = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(ref, () => {
      return {
        focus() {
          dropzoneRef.current?.classList.remove("animate-dropzone-feedback");
          requestAnimationFrame(() => {
            dropzoneRef.current?.classList.add("animate-dropzone-feedback");
          });
        },
      };
    });

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dropzoneRef.current?.classList.add("border-muted-foreground/50");
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dropzoneRef.current?.classList.remove("border-muted-foreground/50");
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const { files } = e.dataTransfer;
      files.length && onChange(files);
      dropzoneRef.current?.classList.remove("border-muted-foreground/50");
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;
      files && onChange(files);
    };

    const handleButtonClick = () => {
      fileInputRef.current && fileInputRef.current.click();
    };

    return (
      <Card
        className={cn(
          "border-2 border-dashed bg-muted hover:cursor-pointer hover:border-muted-foreground/50",
          className
        )}
        onDoubleClick={handleButtonClick}
        ref={dropzoneRef}
      >
        <CardContent
          className="flex flex-col items-center justify-center space-y-2 px-2 py-4 text-xs"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex items-center justify-center text-muted-foreground">
            <span className="font-medium">Drag Files to Upload or</span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto flex h-8 space-x-2 px-0 pl-1 text-xs"
              onClick={handleButtonClick}
              type="button"
            >
              Click Here
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileInputChange}
              className="hidden"
              {...props}
            />
          </div>
          {message && <p className="text-muted-foreground">{message}</p>}
        </CardContent>
      </Card>
    );
  }
);

Dropzone.displayName = "Dropzone";
