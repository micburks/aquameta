# Widgets

## All widget tables

### widget.widget

| id | name | html | css | state | documentation |
| -- | ---- | ---- | --- | ----- | ------------- |


### widget.view

| id | widget id | view id |
| -- | --------- | ------- |


### widget.input

| id | name | default | required |
| -- | ---- | ------- | -------- |


### widget.event

| id | name | script |
| -- | ---- | ------ |


### widget.lang

| id | locale | data |
| -- | ------ | ---- |


### widget.dependencies

| id | parent_widget_id | child_widget_id |
| -- | ---------------- | --------------- |


## Future features

widget.js_dependency
widget.css_dependency


# Templates attributes

{{var}}
---
Interpolate variable value
example: `{{name}}`

:bind
---
pass the state variable into the component
example: `:inputProduct="product"`

@event
---
perform the given fsm event or expression when this even is emitted
example: `@click="fsmEvent"`

meta-if 
---
create element if condition is true
remove element if condition is false
example: `meta-if="products.length === 0"`

meta-each
---
loop through array
example: `meta-each="product in products"`

meta-action
---
specify the CRUD operation to perform i.e. insert|update|delete
example: `meta-action="insert"`

meta-datum
---
bind the datum to the component
the component will receive all fields of the datum as inputs
example: `meta-datum="product"`

meta-lang
---
specify the language of the component tree
example: `meta-lang="en"`
