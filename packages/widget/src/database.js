import { database } from 'aquameta-datum'

export const widgetTable = database.relation('widget.widget')
export const inputTable = database.relation('widget.input')
export const eventTable = database.relation('widget.event')
export const langTable = database.relation('widget.lang')
export const viewTable = database.relation('widget.view')
