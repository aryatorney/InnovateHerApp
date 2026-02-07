interface ClosingMessageProps {
  message: string;
}

export default function ClosingMessage({ message }: ClosingMessageProps) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo/10 to-violet/10 p-6 text-center">
      <p className="text-lg leading-relaxed font-medium italic text-foreground/80">
        &ldquo;{message}&rdquo;
      </p>
    </div>
  );
}
