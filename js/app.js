import {fetchData, hidePreloader} from './modules/utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    const audioBtn = document.getElementById('audio-btn');
    const copyBtn = document.getElementById('copy-btn');
    const twitterBtn = document.getElementById('twitter-btn');
    const generateQuoteBtn = document.getElementById('generate-quote-btn');
    const quoteDOM = document.querySelector('.quote');
    const quoteAuthorDOM = document.querySelector('.quote-author');
    const tagsListDOM = document.getElementById('tags-list');
    const tagsListUrl = 'https://api.quotable.io/tags';
    const tagsListData = await fetchData(tagsListUrl);
    if (tagsListData.statusCode === 404) {
        alert(tagsListData.statusMessage);
        return;
    }
    const tagsList = tagsListData.filter(item => item.quoteCount >= 4);
    const quotesTotalAmount = tagsList.reduce((amount, item) => amount += item.quoteCount, 0);
    tagsList.unshift({name: 'all', quoteCount: quotesTotalAmount});
    tagsListDOM.innerHTML = tagsList.map(item => {
        return `<option value="${item.name}">${item.name} (${item.quoteCount})</option>`;
    }).join('');

    generateQuoteBtn.addEventListener('click', async () => {
        generateQuoteBtn.parentElement.classList.add('disabled');
        generateQuoteBtn.textContent = 'loading...';
        const randomQuoteUrl = `https://api.quotable.io/random${tagsListDOM.value !== 'all' ? '?tags=' + tagsListDOM.value : ''}`;
        const randomQuoteData = await fetchData(randomQuoteUrl);
        if (randomQuoteData.statusCode === 404) {
            alert(randomQuoteData.statusMessage);
        } else {
            quoteDOM.innerHTML = `<i class="fas fa-quote-left"></i> ${randomQuoteData.content}`;
            quoteAuthorDOM.textContent = `— ${randomQuoteData.author}`;
        }
        generateQuoteBtn.parentElement.classList.remove('disabled');
        generateQuoteBtn.textContent = 'new quote';
    });

    audioBtn.addEventListener('click', () => {
        if (!window.speechSynthesis) {
            alert('Speech reading is not supported in this browser');
            return;
        }
        audioBtn.classList.add('active');
        const utterThis = new SpeechSynthesisUtterance(`${quoteDOM.textContent} by ${quoteAuthorDOM.textContent}`);
        utterThis.lang = 'en-US';
        window.speechSynthesis.speak(utterThis);
        utterThis.addEventListener('end', () => audioBtn.classList.remove('active'));
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(`${quoteDOM.textContent} ${quoteAuthorDOM.textContent}`).then(() => {
            copyBtn.classList.add('active');
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyBtn.classList.remove('active');
                copyBtn.innerHTML = '<i class="fas fa-copy">';
            }, 500);
        }).catch(() => alert('Sorry, failed to copy...'));
    });

    twitterBtn.addEventListener('click', () => {
        const twitterUrl = `https://twitter.com/intent/tweet?url=${quoteDOM.textContent} by ${quoteAuthorDOM.textContent}`;
        window.open(twitterUrl, '_blank');
    });

    generateQuoteBtn.click();
});

window.addEventListener('load', hidePreloader);