import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MessageSquare, Plus, Trash2, Loader2 } from 'lucide-react';
import { useAppStore } from '../hooks/useAppStore';
import { toast } from 'sonner@2.0.3';

interface NotesSectionProps {
  entityType: 'partner' | 'contract';
  entityId: string;
}

export function NotesSection({ entityType, entityId }: NotesSectionProps) {
  const { reads, actions } = useAppStore('notes');
  const [newNote, setNewNote] = useState('');
  const [saving, setSaving] = useState(false);

  const notes = useMemo(
    () => reads.getNotesByEntity(entityType, entityId),
    [reads, entityType, entityId]
  );

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setSaving(true);
    const result = await actions.addNote({
      entityType,
      entityId,
      content: newNote.trim(),
    });
    setSaving(false);
    if (result.success) {
      setNewNote('');
      toast.success('Note added');
    } else {
      toast.error(result.error.message);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    const result = await actions.deleteNote(noteId);
    if (result.success) {
      toast.success('Note deleted');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Notes ({notes.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add note input */}
        <div className="flex items-center gap-2 mb-4">
          <Input
            placeholder="Add a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={saving}
          />
          <Button onClick={handleAddNote} disabled={saving || !newNote.trim()} size="sm">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          </Button>
        </div>

        {/* Notes list */}
        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No notes yet.</p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive h-7 w-7 p-0 shrink-0"
                  onClick={() => handleDeleteNote(note.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}