module.exports = p => {
return `<div>
    <div class="header" data-js="header">
        <div class="pre-context" data-js="preContext" >${p.preContext || ''}</div>
        <div><img data-js="context" class="context" src="${p.context || ''}"/></div>
        <div class="post-context" data-js="postContext" >${p.postContext || ''}</div>
        ${p._id && p.user._id && !p.opts.readOnly ? '<button class="delete" data-js="delete"></button>' : ''}
        ${p._id && p.user._id && !p.opts.readOnly ? '<button class="edit" data-js="edit"></button>' : ''}
    </div>
    ${p._id && p.user._id && !p.opts.readOnly
        ? `<div class="confirm hidden" data-js="confirmDialog">
               <span>Are you sure?</span>
               <button data-js="confirm" type="button">Delete</button> 
               <button data-js="cancel" type="button">Cancel</button> 
           </div>`
        : ``}
    <div class="clearfix">
        <div class="date">${(require('moment'))(p.created).format('MM-DD-YYYY')}</div>
    </div>
    <img data-js="image" src="${p.image ? p.image : ''}"/>
    ${p.opts.readOnly
        ? `<div class="clearfix">
             <div class="share">
                 ${require('./lib/facebook')}
                 ${require('./lib/twitter')}
                 ${require('./lib/google')}
                 <a href="mailto:badhombre@tinyhanded.com">${require('./lib/mail')}</a>
             </div>
             <!-- <div class="store" data-js="store">Store</div> -->
         </div>`
        : `` }
</div>`
}
