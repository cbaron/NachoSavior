module.exports = p => 
`<div>
    <div class="header" data-js="header">
        <div class="title" data-js="title" >${p.title || ''}</div>
        ${p.user._id && !p.opts.readOnly ? '<button class="delete" data-js="delete"></button>' : ''}
        ${p.user._id && !p.opts.readOnly ? '<button class="edit" data-js="edit"></button>' : ''}
    </div>
    ${p.user._id && !p.opts.readOnly
        ? `<div class="confirm hidden" data-js="confirmDialog">
               <span>Are you sure?</span>
               <button data-js="confirm" type="button">Delete</button> 
               <button data-js="cancel" type="button">Cancel</button> 
           </div>`
        : ``}
    <img data-js="image" src="${p.image}"/>
</div>`
