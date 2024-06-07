import React, { useRef, ComponentProps } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ACCEPTED_IMAGE_MIME_TYPES } from "@/settings";

interface ImageDropzoneProps extends Omit<ComponentProps<"input">, "onChange"> {
  onChange: (files: FileList | null) => void;
  fileInfo?: string;
}

export const ImageDropzone = ({
  onChange,
  fileInfo,
  ...props
}: ImageDropzoneProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dropzoneRef = useRef<HTMLDivElement | null>(null);

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
    files && onChange(files);
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
      className="border-2 border-dashed bg-muted hover:cursor-pointer hover:border-muted-foreground/50"
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
            accept={ACCEPTED_IMAGE_MIME_TYPES.join(",")}
            onChange={handleFileInputChange}
            className="hidden"
            {...props}
          />
        </div>
        {fileInfo && <p className="text-muted-foreground">{fileInfo}</p>}
      </CardContent>
    </Card>
  );
};
