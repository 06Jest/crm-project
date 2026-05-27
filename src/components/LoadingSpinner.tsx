type LoadingSpinnerProps = {
  message?: string;
};

export default function LoadingSpinner({ message }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />

      {message && (
        <p className="text-sm text-gray-500">{message}</p>
      )}
    </div>
  );
}