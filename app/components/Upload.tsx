import { CheckCircle2, ImageIcon, UploadIcon } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  PROGRESS_INCREMENT,
  REDIRECT_DELAY_MS,
  PROGRESS_INTERVAL_MS,
} from "../../lib/constants";

interface UploadProps {
  onComplete?: (base64Data: string) => void;
}

const Upload = ({ onComplete }: UploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const { isSignedIn, signIn } = useOutletContext<AuthContext>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const processFile = useCallback(
    (file: File) => {
      if (!isSignedIn) return;

      setFile(file);
      setProgress(0);

      const reader = new FileReader();
      reader.onerror = () => {
        setFile(null);
        setProgress(0);
      };
      reader.onloadend = () => {
        const base64Data = reader.result as string;

        intervalRef.current = setInterval(() => {
          setProgress((prev) => {
            const next = prev + PROGRESS_INCREMENT;
            if (next >= 100) {
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              timeoutRef.current = setTimeout(() => {
                onComplete?.(base64Data);
                timeoutRef.current = null;
              }, REDIRECT_DELAY_MS);
              return 100;
            }
            return next;
          });
        }, PROGRESS_INTERVAL_MS);
      };
      reader.readAsDataURL(file);
    },
    [isSignedIn, onComplete],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isSignedIn) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!isSignedIn) return;

    const droppedFile = e.dataTransfer.files[0];
    const allowedTypes = ["image/jpeg", "image/png"];
    if (droppedFile && allowedTypes.includes(droppedFile.type)) {
      processFile(droppedFile);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSignedIn) return;

    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!isSignedIn) {
      e.preventDefault();
      signIn?.();
    }
  };

  return (
    <div className="upload w-full">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`apple-dropzone group ${isDragging ? "is-dragging" : ""} w-full flex flex-col items-center justify-center cursor-pointer`}
          >
            <input
              type="file"
              className="drop-input absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              accept=".jpg, .jpeg, .png"
              onClick={handleInputClick}
              onChange={handleChange}
            />

            <div className="drop-content flex flex-col items-center pointer-events-none z-20">
              <div className="glass-icon-badge mb-4">
                <UploadIcon size={22} className="text-zinc-600 group-hover:text-primary transition-colors" />
              </div>

              <h3 className="text-base font-sans font-semibold text-zinc-800 mb-1">
                {isSignedIn
                  ? "Click to upload or just Drag & Drop"
                  : "Sign in with Puter to upload"}
              </h3>

              <p className="text-zinc-400 text-xs font-sans">
                {isSignedIn ? "Supports JPG, PNG up to 10MB" : "Connect your account to save designs"}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="status"
            initial={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="apple-dropzone w-full flex flex-col items-center justify-center p-8 bg-white/40"
          >
            <div className="status-content flex flex-col items-center justify-center text-center w-full z-10">
              <div className="glass-icon-badge mb-4">
                {progress === 100 ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-primary animate-pulse" />
                )}
              </div>

              <h4 className="text-zinc-800 font-sans font-medium text-sm truncate max-w-[260px] mb-4">
                {file.name}
              </h4>

              <div className="flex flex-col items-center w-full gap-2">
                <div className="apple-progress-container">
                  <div className="apple-progress-bar" style={{ width: `${progress}%` }} />
                </div>

                <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mt-1">
                  {progress < 100 ? "Analyzing Floor Plan..." : "Redirecting..."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Upload;
