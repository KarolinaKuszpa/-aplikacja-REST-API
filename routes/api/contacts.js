const express = require('express')
const router = express.Router()
const {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
} = require('../../models/contacts')

router.get('/', async (req, res, next) => {
    try {
        const contacts = await listContacts()
        res.json(contacts)
    } catch (error) {
        next(error)
    }
})

router.get('/:contactId', async (req, res, next) => {
    const { contactId } = req.params
    try {
        const contact = await getContactById(Number(contactId))
        res.json(contact)
    } catch (error) {
        next(error)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const newContact = await addContact(req.body)
        res.status(201).json(newContact)
    } catch (error) {
        if (error.message.includes('Validation error')) {
            res.status(400).json({ message: error.message })
        } else {
            next(error)
        }
    }
})

router.delete('/:contactId', async (req, res, next) => {
    const { contactId } = req.params
    try {
        await removeContact(Number(contactId))
        res.json({ message: 'Contact deleted' })
    } catch (error) {
        next(error)
    }
})

router.put('/:contactId', async (req, res, next) => {
    const { contactId } = req.params
    try {
        const updatedContact = await updateContact(Number(contactId), req.body)
        res.json(updatedContact)
    } catch (error) {
        if (error.message.includes('Validation error')) {
            res.status(400).json({ message: error.message })
        } else {
            next(error)
        }
    }
})

module.exports = router
