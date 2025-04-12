'use client';

/**
 * Props for the OutOfStockOverlay component.
 *
 * @param isOutOfStock - A boolean that determines whether the product is out of stock or not.
 * If true, the overlay will be shown. If false, the overlay will not be rendered.
 */
type OutOfStockOverlayProps = {
  isOutOfStock: boolean;
};

/**
 * OutOfStockOverlay component displays an overlay when a product is out of stock.
 *
 * The overlay is shown if the `isOutOfStock` prop is true, and it fades in and out
 * with a smooth transition. The message "Out of Stock" is displayed with prominent
 * styling to make it noticeable.
 *
 * The component uses the `aria-live="assertive"` attribute to ensure that screen readers
 * announce the message immediately when the overlay appears, improving accessibility.
 *
 * @component
 * @example
 * <OutOfStockOverlay isOutOfStock={true} />
 */
const OutOfStockOverlay = ({ isOutOfStock }: OutOfStockOverlayProps) => {
  // If the product is not out of stock, return null (i.e., don't render the overlay).
  if (!isOutOfStock) return null;

  return (
    <div
      // Overlay container that covers the entire screen.
      // Transition opacity to smoothly show/hide the overlay.
      className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out ${
        isOutOfStock ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-live="assertive" // Ensures screen readers announce the message when it appears.
    >
      <span
        // Text styling for the "Out of Stock" message.
        className="text-white font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl px-4 py-2 rounded-lg shadow-md bg-black bg-opacity-70"
      >
        Out of Stock
      </span>
    </div>
  );
};

export default OutOfStockOverlay;
