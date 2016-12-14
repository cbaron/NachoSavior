module.exports = p =>
`<div>
    <div data-js="header"></div>
    <div class="form-group">
       <label class="form-label">title</label>
       <input data-js="title" type="text"></input>
    </div>
    <div class="form-group">
       <label class="form-label">image</label>
        <div>
            <button data-js="upload" class="upload">
                <span>Upload File</span>
                <input type="file" data-js="image" />
            </button>
            <img data-js="preview" />
        </div>
    </div>
    <div>
        <button data-js="submit" class="btn-ghost" type="button">Submit</button>
        <button data-js="cancel" class="btn-ghost" type="button">Cancel</button>
    </div>
</div>`
