// ==UserScript==
// @name         Slash 2 Stash
// @version      2024.11.24.build_00.36.48
// @description  Overlay to extract info, make all fields editable, select one image for JSON POST with CORS support
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @connect      localhost
// @resource     MYCSS https://raw.githubusercontent.com/enfantreble/enfantreble/refs/heads/main/res/css/overlay.css
// @require      file://C:/Code/enfantreble/enfantreble/slash2stash.js?${new Date().getTime()}
// @icon         https://raw.githubusercontent.com/enfantreble/enfantreble/main/res/svg/CD.svg
// ==/UserScript==

(function () {
        'use strict';
        const VERSION_BUILD = '2024.11.24.build_00.36.48';
        const myCss = GM_getResourceText("MYCSS");
        GM_addStyle(myCss);
        
        const createButton = document.createElement('button');
        createButton.textContent = `Extract  ${VERSION_BUILD}`;
        createButton.classList.add('floating-button');
        document.body.appendChild(createButton);
        
        let selectedImage = "";
        let minWidth = 600, minHeight = 400;
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
            
            overlay.innerHTML = `
         <div class="button-container">
             <button id="dismissBtn" class="btn-close btn-danger" style="margin-right: 10px;">Close</button>
             <button id="submitBtn" class="submit-button">Submit</button>
         </div>
            <div class="center-container">
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
            <div>
                <label for="minWidth">Min Width:</label>
                <input type="range" id="minWidth" min="0" max="2000" step="10" value="${minWidth}">
                <span id="minWidthValue">${minWidth}px</span>
            </div>
            <div>
                <label for="minHeight">Min Height:</label>
                <input type="range" id="minHeight" min="0" max="2000" step="10" value="${minHeight}">
                <span id="minHeightValue">${minHeight}px</span>
               </div>
            </div>
            <div id="imageContainer" class="image-container"></div>
        `;
            
            document.getElementById('minWidth').addEventListener('input', updateImageFilters);
            document.getElementById('minHeight').addEventListener('input', updateImageFilters);

    // Trigger the image filter update directly
    updateImageFilters();
            
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
                
                try {
                    const response = await fetch(selectedImage);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch image: ${response.statusText}`);
                    }
                    
                    const base64Image = canvas.toDataURL("image/png");
                    console.log("Extracted Base64 Image:", base64Image);
                    
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
                        query: `mutation PerformerCreate($input: PerformerCreateInput!) {
                        performerCreate(input: $input) {
                            id
                            name
                            urls
                            country
                            image_path
                        }
                    }`
                    });
                    
                    console.log("Submitting Data:", data);
                    alert("Base64 data extracted and ready for submission!");
                    
                    const submissionResponse = await fetch('http://localhost:9000/graphql', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: data
                    });
                    
                    if (submissionResponse.ok) {
                        const result = await submissionResponse.json();
                        alert("Submission successful: " + JSON.stringify(result));
                    } else {
                        const errorText = await submissionResponse.text();
                        console.error("Submission failed:", errorText);
                        alert("Error: Submission failed. See console for details.");
                    }
                } catch (e) {
                    console.error("Failed to fetch image or submit data:", e);
                    alert("Error: Could not complete the operation.");
                }
            });
            
            document.getElementById('dismissBtn').addEventListener('click', () => {
                overlay.remove();
                overlayBackground.remove();
            });
            
            function updateImageFilters() {
                minWidth = parseInt(document.getElementById('minWidth').value, 10);
                minHeight = parseInt(document.getElementById('minHeight').value, 10);
                document.getElementById('minWidthValue').textContent = `${minWidth}px`;
                document.getElementById('minHeightValue').textContent = `${minHeight}px`;
                updateImageContainer();
            }
            
            function updateImageContainer() {
                const imageContainer = document.getElementById('imageContainer');
                imageContainer.innerHTML = ''; // Clear existing images

                imageContainer.innerHTML = Array.from(document.querySelectorAll('img'))
                .filter(img => img.naturalWidth > minWidth && img.naturalHeight > minHeight)
                .map(({src, naturalWidth, naturalHeight}) => `
            <div class="image-wrapper" style="width: ${naturalWidth > naturalHeight ? '500px' : '350px'}; height: ${naturalWidth > naturalHeight ? '350px' : '500px'};">
                <img src="${src}" alt="Extracted image" class="selectable-image">
            </div>
        `).join('');
            }
        }
        
        const regexPatterns = {
            allmylinks: /(?:https?:\/\/)?(?:www\.)?allmylinks\.com\/([a-zA-Z0-9_.-]+)\/?$/,
            babepedia: /(?:https?:\/\/)?(?:www\.)?babepedia\.com\/babe\/([a-zA-Z0-9_.-]+)\/?$/,
            onlyfansbabepedia: /(?:https?:\/\/)?(?:www\.)?babepedia\.com\/onlyfans\/([a-zA-Z0-9_.-]+)\/?$/,
            beacons: /(?:https?:\/\/)?(?:www\.)?beacons\.ai\/([a-zA-Z0-9_.-]+)\/?$/,
            facebook: /(?:https?:\/\/)?(?:www\.)?facebook\.com\/([a-zA-Z0-9_.-]+)\/?$/,
            fansly: /(?:https?:\/\/)?(?:www\.)?fans\.ly\/([a-zA-Z0-9_.-]+)\/?$/,
            instagram: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9_.-]+)\/?$/,
            linktree: /(?:https?:\/\/)?(?:www\.)?linktr\.ee\/([a-zA-Z0-9_.-]+)\/?$/,
            onlyfans: /(?:https?:\/\/)?(?:www\.)?onlyfans\.com\/([a-zA-Z0-9_.-]+)\/?$/,
            reddit: /(?:https?:\/\/)?(?:www\.)?reddit\.com\/user\/([a-zA-Z0-9_.-]+)\/?$/,
            tiktok: /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@([a-zA-Z0-9_.-]+)\/?$/,
            twitch: /(?:https?:\/\/)?(?:www\.)?twitch\.tv\/([a-zA-Z0-9_.-]+)\/?$/,
            twitter: /(?:https?:\/\/)?(?:www\.)?twitter\.com\/([a-zA-Z0-9_.-]+)\/?$/,
            x: /(?:https?:\/\/)?(?:www\.)?x\.com\/([a-zA-Z0-9_.-]+)\/?$/,
        };
        
        function extractProfileInfo() {
            const currentUrl = window.location.href;
            let name = "";
            let performerUrls = [];
            const blacklist = ["cookies", "help", "privacy", "terms", 'blog', 'explore', 'reels', 'duca.calin', 'galaxytimestwo', 'twitter.com\/Babepedia'];
            for (const [platform, regex] of Object.entries(regexPatterns)) {
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
    }
)();
