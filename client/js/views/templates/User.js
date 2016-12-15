module.exports = p =>
`<div>
    <div data-js="username">${p.username}</div>
    ${p.user._id === p._id ? '<button class="edit" data-js="edit"></button>' : ''}
</div>
`
