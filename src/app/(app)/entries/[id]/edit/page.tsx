import { notFound } from "next/navigation";
import { getEntry } from "@/server/entries";
import { EntryEditor } from "@/components/editor/EntryEditor";

interface EditEntryPageProps {
  params: { id: string };
}

export default async function EditEntryPage({ params }: EditEntryPageProps) {
  const entry = await getEntry(params.id);

  if (!entry) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <EntryEditor
        tripId={entry.tripId}
        initialEntry={entry}
        isNew={false}
      />
    </div>
  );
}
