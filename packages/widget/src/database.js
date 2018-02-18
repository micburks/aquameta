import { datum } from 'aquameta-datum'

const db = datum({})

export const widgetTable = db.schema('widget').relation('widget')
export const inputTable = db.schema('widget').relation('input')
export const eventTable = db.schema('widget').relation('event')
export const langTable = db.schema('widget').relation('lang')
export const viewTable = db.schema('widget').relation('view')
