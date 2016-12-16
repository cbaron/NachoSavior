module.exports = p =>
`<div>
    <div data-js="username">${p.username}</div>
    ${p.user._id && !p.opts.readOnly ? '<button class="delete" data-js="delete"></button>' : ''}
    ${p.user._id === p._id ? '<button class="edit" data-js="edit"></button>' : ''}
    ${p.user._id && !p.opts.readOnly
    ? `<div class="confirm hidden" data-js="confirmDialog">
           <span>Are you sure?</span>
           <button data-js="confirm" type="button">Delete</button> 
           <button data-js="cancel" type="button">Cancel</button> 
       </div>`
    : ``}
</div>
`
