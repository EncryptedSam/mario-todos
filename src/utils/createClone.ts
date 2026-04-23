function createClone(e: React.DragEvent): HTMLElement {
  const target = e.currentTarget as HTMLElement;

  const rect = target.getBoundingClientRect();

  const clone = target.cloneNode(true) as HTMLElement;

  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;

  clone.style.position = "fixed";
  clone.style.top = "-9999px";
  clone.style.left = "-9999px";

  clone.style.borderRadius = "12px";
  clone.style.overflow = "hidden";
  clone.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
  clone.style.boxSizing = "border-box";
  clone.style.background = "rgba(243, 244, 246, 0.8)";

  document.body.appendChild(clone);

  e.dataTransfer.setDragImage(clone, rect.width / 2, rect.height / 2);
  return clone;
}


export default createClone;