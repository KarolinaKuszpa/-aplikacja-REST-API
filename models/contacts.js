const fs = require('fs/promises')
const path = require('path')

const contactsFilePath = path.join(__dirname, '../data/Contacts.json')

const listContacts = async () => {
    const data = await fs.readFile(contactsFilePath, 'utf-8')
    return JSON.parse(data)
}

const getContactById = async (contactId) => {
    const contacts = await listContacts()
    return contacts.find((contact) => contact.id === contactId)
}

const removeContact = async (contactId) => {
    const contacts = await listContacts()
    const updatedContacts = contacts.filter(
        (contact) => contact.id !== contactId
    )
    await fs.writeFile(
        contactsFilePath,
        JSON.stringify(updatedContacts, null, 2)
    )
    return true
}

const addContact = async (body) => {
    const contacts = await listContacts()
    const newContact = { id: Date.now().toString(), ...body }
    contacts.push(newContact)
    await fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 2))
    return newContact
}

const updateContact = async (contactId, body) => {
    const contacts = await listContacts()
    const contactIndex = contacts.findIndex(
        (contact) => contact.id === contactId
    )
    if (contactIndex === -1) return null
    const updatedContact = { ...contacts[contactIndex], ...body }
    contacts[contactIndex] = updatedContact
    await fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 2))
    return updatedContact
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
}
