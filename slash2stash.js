// ==UserScript==
// @name         Slash 2 Stash
// @version      0.2.5.12
// @description  Overlay to extract info, make all fields editable, select one image for JSON POST with CORS support
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @connect      localhost
// @resource     MYCSS https://raw.githubusercontent.com/enfantreble/enfantreble/refs/heads/main/res/css/overlay.css
// @require      file://C:/Code/exioscherio/src/slash2stash.js?${new Date().getTime()}
// @icon         https://raw.githubusercontent.com/enfantreble/enfantreble/main/res/svg/CD.svg
// ==/UserScript==

(function () {
    'use strict';
    const myCss = GM_getResourceText("MYCSS");
    GM_addStyle(myCss);
    
    const createButton = document.createElement('button');
    createButton.textContent = 'Extract  0.2.5.12';
    createButton.classList.add('floating-button');
    document.body.appendChild(button);
    
    let selectedImage = "";
    
    createButton.addEventListener('click', showOverlay);
    
    function showOverlay() {
        if (document.querySelector('.overlay-panel')) {
            document.querySelector('.overlay-panel').remove();
        }
        
        const overlay = document.createElement('div');
        overlay.classList.add('overlay-panel');
        document.body.appendChild(overlay);
        
        const overlayBackground = document.createElement('div');
        overlayBackground.classList.add('overlay-background');
        document.body.appendChild(overlayBackground);
        
        overlayBackground.addEventListener('click', () => {
            overlay.remove();
            overlayBackground.remove();
        });
        
        const profileInfo = extractProfileInfo();
        const username = profileInfo.name || "N/A";
        const socialLinks = profileInfo.urls;
        
        const images = Array.from(document.querySelectorAll('img'))
        .filter(img => img.naturalWidth > 600 && img.naturalHeight > 400)
        .map(img => ({ src: img.src, width: img.naturalWidth, height: img.naturalHeight }));
        
        overlay.innerHTML = `
         <div class="button-container">
             <button id="dismissBtn" class="btn-close btn-danger" style="margin-right: 10px;">Close</button>
             <button id="submitBtn" class="submit-button">Submit</button>
         </div>
            <h3 class="overlay-title">Extracted Information</h3>
            <p><strong>Name:</strong> <input type="text" id="name" value="${username}" class="input-field"></p>
            <p><strong>Country:</strong> <input type="text" id="country" value="" class="input-field"></p>
            <p><strong>Social Media Links:</strong></p>
            <ul id="URL" class="link-list">${socialLinks.map(link => `
                <li class="link-item">
                    <input type="text" value="${link}" class="input-field">
                    <button type="button" class="btn-danger btn-remove">Remove</button>
                </li>`).join('')}
            </ul>
            <div id="imageContainer" class="image-container">
                ${images.map(({ src, width, height }) => `
                    <div class="image-wrapper" style="width: ${width > height ? '500px' : '350px'}; height: ${width > height ? '350px' : '500px'};">
                <img src="${src}" alt="Extracted image" class="selectable-image">
                    </div>`).join('')}
            </div>
        `;
        
        overlay.querySelectorAll('.btn-remove').forEach(button => button.addEventListener('click', function () {
            this.parentNode.remove();
        }));
        
        overlay.querySelectorAll('.selectable-image').forEach(img => {
            img.addEventListener('click', () => {
                overlay.querySelectorAll('.selectable-image').forEach(i => i.classList.remove('selected-image'));
                img.classList.add('selected-image');
                selectedImage = img.src;
            });
        });
        
        document.getElementById('submitBtn').addEventListener('click', async () => {
            const name = document.getElementById('name').value;
            const country = document.getElementById('country').value;
            const urls = Array.from(document.querySelectorAll('#URL input')).map(link => link.value).filter(Boolean);
            
            if (!selectedImage) {
                alert("Error: Please select an image before submitting.");
                return;
            }
            
            // Find the <img> element in the DOM
            const imgElement = Array.from(document.querySelectorAll('img')).find(img => img.src === selectedImage);
            if (!imgElement) {
                alert("Error: Selected image element not found in the DOM.");
                return;
            }
            
            // Use html2canvas to capture the image wrapper or image element
            try {
                const canvas = await html2canvas(imgElement, {
                    allowTaint: true,
                    useCORS: true
                });
                
                // Extract base64 from the captured canvas
                const base64Image = canvas.toDataURL("image/png");
                console.log("Extracted Base64 Image:", base64Image);
                
                // Prepare data for submission
                const data = JSON.stringify({
                    operationName: "PerformerCreate",
                    variables: {
                        input: {
                            name: name,
                            country: country,
                            urls: urls,
                            image: base64Image
                        }
                    },
                    query: "mutation PerformerCreate($input: PerformerCreateInput!) {\n  performerCreate(input: $input) {\n    id\n    name\n    urls\n    country\n    image_path\n  }\n}"
                });
                
                console.log("Submitting Data:", data);
                alert("Base64 data extracted and ready for submission!");
                
                // Submit or log the extracted data
            } catch (e) {
                console.error("Failed to capture image:", e);
                alert("Error: Could not capture the image.");
            }
        });
        
        document.getElementById('dismissBtn').addEventListener('click', () => {
            overlay.remove();
            overlayBackground.remove();
        });
    }
    
    const regexPatterns = {
        allmylinks: /(?:https?:\/\/)?(?:www\.)?allmylinks\.com\/([a-zA-Z0-9_.-]+)\/?$/,
        babepedia: /(?:https?:\/\/)?(?:www\.)?babepedia\.com\/babe\/([a-zA-Z0-9_.-]+)\/?$/,
        onlyfansbabepedia: /(?:https?:\/\/)?(?:www\.)?babepedia\.com\/babe\/([a-zA-Z0-9_.-]+)\/?$/,
        beacons: /(?:https?:\/\/)?(?:www\.)?beacons\.ao\/([a-zA-Z0-9_.-]+)\/?$/,
        facebook: /(?:https?:\/\/)?(?:www\.)?facebook\.com\/([a-zA-Z0-9_.-]+)\/?$/,
        fansly: /(?:https?:\/\/)?(?:www\.)?fans\.ly\/([a-zA-Z0-9_.-]+)\/?$/,
        instagram: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9_.-]+)\/?$/,
        linktree: /(?:https?:\/\/)?(?:www\.)?linktr\.ee\/([a-zA-Z0-9_.-]+)\/?$/,
        onlyfans: /(?:https?:\/\/)?(?:www\.)?onlyfans\.com\/([a-zA-Z0-9_.-]+)\/?$/,
        reddit: /(?:https?:\/\/)?(?:www\.)?reddit\.com\/user\/([a-zA-Z0-9_.-]+)\/?$/,
        tiktok: /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@([a-zA-Z0-9_.-]+)\/?$/,
        twitch: /(?:https?:\/\/)?(?:www\.)?twitch\.tb\/([a-zA-Z0-9_.-]+)\/?$/,
        twitter: /(?:https?:\/\/)?(?:www\.)?twitter\.com\/([a-zA-Z0-9_.-]+)\/?$/,
        x: /(?:https?:\/\/)?(?:www\.)?x\.com\/([a-zA-Z0-9_.-]+)\/?$/,
    };
    
    function extractProfileInfo() {
        const currentUrl = window.location.href;
        let name = "";
        let performerUrls = [];
        
        const blacklist = ["cookies", "help", "privacy", "terms", 'blog', 'explore', 'reels', 'duca.calin', 'galaxytimes2', 'twitter.com\/Babepedia'];
        
    for (const regex of Object.values(regexPatterns)) {
            const match = currentUrl.match(regex);
            if (match) {
                name = match[1];
                performerUrls.push(currentUrl);
                break;
            }
        }
        
        const allLinks = Array.from(document.querySelectorAll('a'));
        allLinks.forEach(link => {
            let linkUrl = link.href;
            let textContentUrl = link.textContent.trim();
            const beforeContent = getComputedStyle(link, '::before').content.replace(/^"|"$/g, '').trim();
            const afterContent = getComputedStyle(link, '::after').content.replace(/^"|"$/g, '').trim();
            const potentialUrls = [linkUrl, textContentUrl, beforeContent, afterContent].filter(Boolean);
            const filteredUrls = potentialUrls.filter(url => !blacklist.some(term => url.toLowerCase().includes(term)));
            filteredUrls.forEach(url => {
                for (const regex of Object.values(regexPatterns)) {
                    const match = url.match(regex);
                    if (!name && match && !url.includes('onlyfans')) {
                        name = match[1];
                    }
                    if (match && !performerUrls.includes(url)) {
                        performerUrls.push(url);
                    }
                }
            });
        });
        
        return {name, urls: performerUrls};
    }
})();
