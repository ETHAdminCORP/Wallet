function globalListener(e){
    if(!e.target.closest('[data-dropdown-conponent]')){
        document.querySelector('[data-dropdown-element = "list"]').style.display = "none";
        document.removeEventListener('click',globalListener);
    }
}
function getInitialLang(){
    let lang = document.querySelector('#langId').value;
    let chosen =  (lang.split('-')[0].toLowerCase() === 'ru') ?
            '<img src = "/assets/img/ru.svg" alt="Русский">' :
            '<img src="/assets/img/en.svg" alt="English" />';
    document.querySelector('[data-dropdown-element = "current"]').innerHTML = '<span>' + chosen + '</span>';
}
document.addEventListener('DOMContentLoaded', ()=>{
    getInitialLang();
    document.querySelector('[data-dropdown-conponent]').addEventListener('click', (e)=>{
        if(e.target.closest('[data-dropdown-element = "current"]')){
            $('[data-dropdown-element = "list"]').slideDown(200);
            document.addEventListener('click',globalListener)
        }
        if(e.target.closest('[data-dropdown-element = "list"]')){
            let cur = document.querySelector('[data-dropdown-element = "current"]');
            //e.target.closest('li>span>img').getAttribute('src');
            if(cur.innerHTML !== e.target.closest('li').innerHTML){
                cur.innerHTML = e.target.closest('li').innerHTML;
                //let event = new Event('change');
                let event = document.createEvent('Event');
                event.initEvent('change', true);
                cur.dispatchEvent(event);

            }
            document.querySelector('[data-dropdown-element = "list"]').style.display = "none";
            document.removeEventListener('click',globalListener);
        }
    });
});