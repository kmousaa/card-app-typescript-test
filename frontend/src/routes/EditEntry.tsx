import React, { useState, useContext, ChangeEvent, MouseEvent, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { EntryContext } from '../utilities/globalContext';
import { Entry, EntryContextType } from '../@types/context';

export default function EditEntry() {
  const { id } = useParams<{ id: string }>();
  const emptyEntry: Entry = { title: '', description: '', created_at: new Date(), scheduled_at: new Date() };

  const { updateEntry, entries } = useContext(EntryContext) as EntryContextType;
  const [newEntry, setNewEntry] = useState<Entry>(emptyEntry);

  useEffect(() => {
    const entry = entries.find(entry => entry.id === id);
    if (entry) setNewEntry(entry);
  }, [id, entries]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewEntry(prevState => ({ ...prevState, [name]: name === 'created_at' || name === 'scheduled_at' ? (value ? new Date(value) : null) : value }));
  };

  const handleSend = (e: MouseEvent<HTMLButtonElement>) => updateEntry(String(id), newEntry);

  return (
    <section className="flex justify-center flex-col w-fit ml-auto mr-auto mt-10 gap-5 bg-card p-8 rounded-md">
      <input className="p-3 rounded-md bg-insideCard text-insideText" type="text" placeholder="Title" name="title" value={newEntry.title} onChange={handleInputChange}/>
      <textarea className="p-3 rounded-md bg-insideCard text-insideText" placeholder="Description" name="description" value={newEntry.description} onChange={handleInputChange}/>
      <input className="p-3 rounded-md bg-insideCard text-insideText" type="date" name="created_at" value={newEntry.created_at ? (new Date(newEntry.created_at)).toISOString().split('T')[0] : ''} onChange={handleInputChange}/>
      <input className="p-3 rounded-md bg-insideCard text-insideText" type="date" name="scheduled_at" value={newEntry.scheduled_at ? (new Date(newEntry.scheduled_at)).toISOString().split('T')[0] : ''} onChange={handleInputChange}/>
      <button onClick={handleSend} className="bg-button hover:bg-buttonHover font-semibold text-text p-3 rounded-md">Update</button>
    </section>
  );
}
