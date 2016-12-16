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
            <div data-js="upload" class="upload">
                <span>Upload File</span>
                <input type="file" data-js="image" />
            </div>
            <img class="preview" data-js="preview" />
        </div>
    </div>
    <div class="button-row">
        <button data-js="submit" type="button">Submit</button>
        <button data-js="cancel" type="button">Cancel</button>
    </div>
</div>`
