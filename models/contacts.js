const fs = require('fs/promises')
const path = require('path')

const contactsPath = path.join(__dirname, '..', 'db', 'contacts.json')

const listContacts = async () => {
    const data = await fs.readFile(contactsPath, 'utf-8')
    return JSON.parse(data)
}

const getContactById = async (contactId) => {
    const contacts = await listContacts()
    const contact = contacts.find((c) => c.id === contactId)
    if (!contact) {
        throw new Error('Contact not found')
    }
    return contact
}

const removeContact = async (contactId) => {
    const contacts = await listContacts()
    const updatedContacts = contacts.filter((c) => c.id !== contactId)
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts))
}

const addContact = async (body) => {
    const contacts = await listContacts()
    const newContact = { id: Date.now(), ...body }
    contacts.push(newContact)
    await fs.writeFile(contactsPath, JSON.stringify(contacts))
    return newContact
}

const updateContact = async (contactId, body) => {
    const contacts = await listContacts()
    const updatedContacts = contacts.map((c) =>
        c.id === contactId ? { ...c, ...body } : c
    )
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts))
    return getContactById(contactId)
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
}
