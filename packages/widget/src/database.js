import { datum } from 'aquameta-datum'

const db = datum({})

export const widgetTable = db.schema('widget').table('widget')
export const inputTable = db.schema('widget').table('input')
export const eventTable = db.schema('widget').table('event')
export const langTable = db.schema('widget').table('lang')
export const viewTable = db.schema('widget').table('view')
