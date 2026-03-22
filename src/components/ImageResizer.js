"use client";

import { useRef } from "react";

// Direction constants matching playground
const Direction = {
  east: 1,
  north: 8,
  northEast: 9,
  northWest: 12,
  south: 2,
  southEast: 3,
  southWest: 6,
  west: 4,
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function ImageResizer({
  editor,
  imageRef,
  maxWidth,
  onResizeStart,
  onResizeEnd,
  showCaption,
  setShowCaption,
  captionsEnabled,
}) {
  const controlWrapperRef = useRef(null);
  const userSelectRef = useRef({
    priority: "",
    value: "default",
  });
  const positioningRef = useRef({
    currentHeight: 0,
    currentWidth: 0,
    direction: 0,
    isResizing: false,
    ratio: 0,
    startHeight: 0,
    startWidth: 0,
    startX: 0,
    startY: 0,
  });

  const editorRootElement = editor.getRootElement();
  const maxWidthContainer = maxWidth
    ? maxWidth
    : editorRootElement !== null
      ? editorRootElement.getBoundingClientRect().width - 20
      : 100;

  const handlePointerDown = (event, direction) => {
    if (!editor.isEditable()) return;

    const image = imageRef.current;
    const controlWrapper = controlWrapperRef.current;
    if (image === null || controlWrapper === null) return;

    event.preventDefault();

    const { width, height } = image.getBoundingClientRect();
    const positioning = positioningRef.current;
    const userSelect = userSelectRef.current;

    positioning.startWidth = width;
    positioning.startHeight = height;
    positioning.currentWidth = width;
    positioning.currentHeight = height;
    positioning.startX = event.clientX;
    positioning.startY = event.clientY;
    positioning.isResizing = true;
    positioning.direction = direction;
    positioning.ratio = width / height;

    userSelect.value = document.body.style.userSelect || "";
    userSelect.priority =
      document.body.style.getPropertyPriority("user-select");
    document.body.style.setProperty("user-select", "none", "important");

    // Disable editor while resizing so contentEditable doesn't fight pointer events
    editor.setEditable(false);
    onResizeStart();

    controlWrapper.setPointerCapture(event.pointerId);
    controlWrapper.addEventListener("pointermove", handlePointerMove);
    controlWrapper.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerMove = (event) => {
    const image = imageRef.current;
    const positioning = positioningRef.current;
    if (!image || !positioning.isResizing) return;

    const { direction, startWidth, startHeight, startX, startY, ratio } =
      positioning;
    const isHorizontal = direction & (Direction.east | Direction.west);
    const isVertical = direction & (Direction.south | Direction.north);

    let newWidth = startWidth;
    let newHeight = startHeight;

    if (isHorizontal && !isVertical) {
      // Pure horizontal resize — maintain aspect ratio
      const diffX = event.clientX - startX;
      newWidth =
        direction & Direction.east
          ? clamp(startWidth + diffX, 100, maxWidthContainer)
          : clamp(startWidth - diffX, 100, maxWidthContainer);
      newHeight = newWidth / ratio;
    } else if (isVertical && !isHorizontal) {
      // Pure vertical resize — maintain aspect ratio
      const diffY = event.clientY - startY;
      newHeight =
        direction & Direction.south
          ? clamp(startHeight + diffY, 50, 2000)
          : clamp(startHeight - diffY, 50, 2000);
      newWidth = newHeight * ratio;
    } else {
      // Corner resize — free aspect ratio
      const diffX = event.clientX - startX;
      const diffY = event.clientY - startY;

      if (direction & Direction.east) {
        newWidth = clamp(startWidth + diffX, 100, maxWidthContainer);
      } else {
        newWidth = clamp(startWidth - diffX, 100, maxWidthContainer);
      }
      if (direction & Direction.south) {
        newHeight = clamp(startHeight + diffY, 50, 2000);
      } else {
        newHeight = clamp(startHeight - diffY, 50, 2000);
      }
    }

    positioning.currentWidth = newWidth;
    positioning.currentHeight = newHeight;

    image.style.width = `${newWidth}px`;
    image.style.height = `${newHeight}px`;
  };

  const handlePointerUp = (event) => {
    const image = imageRef.current;
    const positioning = positioningRef.current;
    const controlWrapper = controlWrapperRef.current;
    if (!image || !controlWrapper) return;

    const userSelect = userSelectRef.current;
    positioning.isResizing = false;
    controlWrapper.releasePointerCapture(event.pointerId);
    controlWrapper.removeEventListener("pointermove", handlePointerMove);
    controlWrapper.removeEventListener("pointerup", handlePointerUp);

    document.body.style.setProperty(
      "user-select",
      userSelect.value,
      userSelect.priority,
    );

    // Re-enable editor and commit final size
    editor.setEditable(true);
    onResizeEnd(positioning.currentWidth, positioning.currentHeight);
  };

  // Handle style for each of the 8 resize handles
  const handleStyle = (direction) => {
    const base = {
      position: "absolute",
      width: "10px",
      height: "10px",
      backgroundColor: "#1a73e8",
      border: "2px solid #fff",
      borderRadius: "50%",
      zIndex: 10,
      boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
    };

    switch (direction) {
      case Direction.north:
        return {
          ...base,
          top: "-5px",
          left: "calc(50% - 5px)",
          cursor: "n-resize",
        };
      case Direction.south:
        return {
          ...base,
          bottom: "-5px",
          left: "calc(50% - 5px)",
          cursor: "s-resize",
        };
      case Direction.east:
        return {
          ...base,
          right: "-5px",
          top: "calc(50% - 5px)",
          cursor: "e-resize",
        };
      case Direction.west:
        return {
          ...base,
          left: "-5px",
          top: "calc(50% - 5px)",
          cursor: "w-resize",
        };
      case Direction.northEast:
        return { ...base, top: "-5px", right: "-5px", cursor: "ne-resize" };
      case Direction.northWest:
        return { ...base, top: "-5px", left: "-5px", cursor: "nw-resize" };
      case Direction.southEast:
        return { ...base, bottom: "-5px", right: "-5px", cursor: "se-resize" };
      case Direction.southWest:
        return { ...base, bottom: "-5px", left: "-5px", cursor: "sw-resize" };
      default:
        return base;
    }
  };

  return (
    <div
      ref={controlWrapperRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      {/* Caption toggle button */}
      {captionsEnabled && (
        <button
          style={{
            position: "absolute",
            bottom: "8px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.65)",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "11px",
            padding: "3px 8px",
            cursor: "pointer",
            pointerEvents: "all",
            whiteSpace: "nowrap",
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            setShowCaption(!showCaption);
          }}
        >
          {showCaption ? "Hide caption" : "Add caption"}
        </button>
      )}

      {/* 8 resize handles */}
      {Object.entries(Direction).map(([name, dir]) => (
        <div
          key={name}
          style={{ ...handleStyle(dir), pointerEvents: "all" }}
          onPointerDown={(e) => handlePointerDown(e, dir)}
        />
      ))}
    </div>
  );
}
