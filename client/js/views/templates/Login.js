module.exports = ( p ) =>
`<div>
    <h1>Login</h1>
    <div class="form-group">
       <label class="form-label" for="username">username</label>
       <input data-js="username" class="username" type="text"></input>
    </div>
    <div class="form-group">
       <label class="form-label" for="password">password</label>
       <input data-js="password" class="password" type="password"></input>
    </div>
    <div class="button-row">
        <button data-js="submit" class="btn-ghost" type="button">Log In</button>
    </div>
</div>`
