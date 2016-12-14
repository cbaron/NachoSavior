module.exports = p =>
`<div>
    <span data-js="username">${p.username}</span>
    ${p.user._id === p._id ? '<button class="edit" data-js="edit"></button>' : ''}
</div>
`
