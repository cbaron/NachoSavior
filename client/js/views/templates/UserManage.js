module.exports = p =>
`<div>
    <div data-js="title"></div>
    <div class="form-group">
       <label class="form-label" for="username">username</label>
       <input data-js="username" class="username" type="text"></input>
    </div>
    <div class="form-group">
       <label class="form-label" for="password">password</label>
       <input data-js="password" class="password" type="password"></input>
    </div>
    <div>
        <button data-js="submit" class="btn-ghost" type="button">Submit</button>
        <button data-js="cancel" class="btn-ghost" type="button">Cancel</button>
    </div>
</div>`
