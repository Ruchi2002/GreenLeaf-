import { BinaryTreeContent } from './_content';

export default function BinaryTreePage() {
  return (
    <div className="pt-14 w-full min-h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-text">Binary Tree</h1>
        <p className="text-sm text-text-muted mt-0.5">Your binary placement network</p>
      </div>
      <BinaryTreeContent />
    </div>
  );
}
