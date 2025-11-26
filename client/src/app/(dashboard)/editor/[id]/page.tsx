// app/editor/[id]/page.tsx
import React, { Suspense } from "react";
import EditorScreen from "@/screens/dashboard/editor/editor";

interface EditorPageProps {
  params: Promise<{ id: string }>; // Note: params is a Promise in Next.js 15
}

const EditorPage = async ({ params }: EditorPageProps) => {
  // Await the params in Next.js 15
  const resolvedParams = await params;
  const sessionId = resolvedParams.id;
  
  console.log("📌 page.tsx resolved params:", resolvedParams);
  console.log("🎯 Passing sessionId to EditorScreen:", sessionId);

  if (!sessionId) {
    console.error("❌ No sessionId found in params");
    return <div>Session not found</div>;
  }

  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <EditorScreen sessionId={sessionId} />
    </Suspense>
  );
};

export default EditorPage;