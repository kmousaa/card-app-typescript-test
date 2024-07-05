import {useState, useContext, ChangeEvent, MouseEvent} from 'react'
import {EntryContext} from '../utilities/globalContext'
import {Entry, EntryContextType} from '../@types/context'


export default function NewEntry(){
    const emptyEntry: Entry = {title: "", description: "",created_at: new Date(), scheduled_at: new Date()}
    const { saveEntry } = useContext(EntryContext) as EntryContextType
    const [newEntry,setNewEntry] = useState<Entry>(emptyEntry)
    
    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setNewEntry(prevState => ({
          ...prevState,
          [name]: name === 'created_at' || name === 'scheduled_at' ? (value ? new Date(value) : null) : value,
        }));
      };
    
    const handleSend = (e: MouseEvent<HTMLButtonElement>) => {
        saveEntry(newEntry)
        console.log(newEntry)
        setNewEntry(emptyEntry)
    }
    return(
        <section className="flex justify-center flex-col w-fit ml-auto mr-auto mt-10 gap-5 bg-card p-8 rounded-md">
            <input className="p-3 rounded-md bg-insideCard text-insideText" type="text" placeholder="Title" name="title" value={newEntry.title} onChange={handleInputChange}/>
            <textarea className="p-3 rounded-md bg-insideCard text-insideText" placeholder="Description" name="description" value={newEntry.description} onChange={handleInputChange}/>
            Created At:
            <input className="p-3 rounded-md bg-insideCard text-insideText" type="date" name="created_at" value={(new Date(newEntry.created_at)).toISOString().split('T')[0]} onChange={handleInputChange}/>
            Scheduled At:
            <input className="p-3 rounded-md bg-insideCard text-insideText" type="date" name="scheduled_at" value={newEntry.scheduled_at ? (new Date(newEntry.scheduled_at)).toISOString().split('T')[0] : ''} onChange={handleInputChange}/>
            <button onClick={(e) => {handleSend(e)}} className="bg-button hover:bg-buttonHover font-semibold text-text p-3 rounded-md">Create</button>
        </section>
    )
}