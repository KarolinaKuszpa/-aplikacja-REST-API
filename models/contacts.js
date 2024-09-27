const fs = require('fs/promises')
const path = require('path')
const Joi = require('joi')

// const contactsFilePath = path.join(__dirname, '..', 'db', 'contacts.json')
const contactsFilePath = path.join(__dirname, 'contacts.json')
const getContactsList = async () => {
    const data = await fs.readFile(contactsFilePath, 'utf-8')
    return JSON.parse(data)
}

const getContactById = async (contactId) => {
    const contacts = await getContactsList()
    const contact = contacts.find((contact) => contact.id === contactId)
    if (!contact) {
        throw new Error('Contact not found')
    }
    return contact
}

const removeContact = async (contactId) => {
    const contacts = await getContactsList()
    const updatedContacts = contacts.filter(
        (contact) => contact.id !== contactId
    )
    await fs.writeFile(contactsFilePath, JSON.stringify(updatedContacts))
}

const contactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
})

const addContact = async (newContactData) => {
    const { error } = contactSchema.validate(newContactData)
    if (error) {
        throw new Error(`Validation error: ${error.details[0].message}`)
    }

    const contacts = await getContactsList()
    const newContact = { id: Date.now(), ...newContactData }
    contacts.push(newContact)
    await fs.writeFile(contactsFilePath, JSON.stringify(contacts))
    return newContact
}

const updateContact = async (contactId, updatedContactData) => {
    const { error } = contactSchema.validate(updatedContactData)
    if (error) {
        throw new Error(`Validation error: ${error.details[0].message}`)
    }

    const contacts = await getContactsList()
    const updatedContacts = contacts.map((contact) =>
        contact.id === contactId
            ? { ...contact, ...updatedContactData }
            : contact
    )
    await fs.writeFile(contactsFilePath, JSON.stringify(updatedContacts))
    return getContactById(contactId)
}

module.exports = {
    getContactsList,
    getContactById,
    removeContact,
    addContact,
    updateContact,
}
