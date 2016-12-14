module.exports = p => 
`<div>
    <div data-js="title" >${p.title || ''}</div>
    <img data-js="image" src="${p.image}"/>
    <button class="edit" data-js="edit"></button>
</div>`
