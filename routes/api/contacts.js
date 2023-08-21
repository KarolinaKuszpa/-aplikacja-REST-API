const express = require('express')
const router = express.Router()
const {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
} = require('../../models/contacts') // Import funkcji obsługujących operacje na kontaktach
const Joi = require('joi')

const contactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
})

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
        const contact = await getContactById(contactId)
        if (!contact) {
            res.status(404).json({ message: 'Not found' })
            return
        }
        res.json(contact)
    } catch (error) {
        next(error)
    }
})

router.post('/', async (req, res, next) => {
    const { error } = contactSchema.validate(req.body)
    if (error) {
        res.status(400).json({ message: error.details[0].message })
        return
    }
    try {
        const newContact = await addContact(req.body)
        res.status(201).json(newContact)
    } catch (error) {
        next(error)
    }
})

router.delete('/:contactId', async (req, res, next) => {
    const { contactId } = req.params
    try {
        const result = await removeContact(contactId)
        if (!result) {
            res.status(404).json({ message: 'Not found' })
            return
        }
        res.json({ message: 'Contact deleted' })
    } catch (error) {
        next(error)
    }
})

router.put('/:contactId', async (req, res, next) => {
    const { contactId } = req.params
    const { error } = contactSchema.validate(req.body)
    if (error) {
        res.status(400).json({ message: error.details[0].message })
        return
    }
    try {
        const updatedContact = await updateContact(contactId, req.body)
        if (!updatedContact) {
            res.status(404).json({ message: 'Not found' })
            return
        }
        res.json(updatedContact)
    } catch (error) {
        next(error)
    }
})

module.exports = router
