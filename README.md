# Mercaux SFCC Cartridges Integration
This integration contains cartridges for both platforms SFRA and
SiteGenesis architectures. 

Version 20.1.0




Compatibility SFRA:

The Mercaux cartridge is compatible with the latest Storefront Reference Architecture version, 
currently 4.4.1 and 19.10 compatibility mode.



Compatibility SiteGenesis:

This cartridge is based on JS controllers, new job framework and is based on SiteGenesis 20.2 version and 19.10 compatibility mode.



The cartridge works with default English locale for both SFRA and SiteGenesis versions.




More extended documentation about both
architectures you can find at [SFCC Documentation](https://documentation.b2c.commercecloud.salesforce.com/DOC2/index.jsp)
## Description of repository cartridges 
##### SFRA cartridge:
```int_mercaux```

##### SiteGenesis cartridge:
```int_mercaux_sgjc_controllers```

```int_mercaux_sgjc```

##### Business Manager cartridge:
```bm_mercaux```
 
## Installation Guide

---
##### 1) Download cartridge files from B2C Commerce marketplace/repository
*SFRA architecture:*
```int_mercaux```

*SiteGenesis Architecture:*
```int_mercaux_sgjc_controllers```
```int_mercaux_sgjc```

##### 2) Download Business manager cartridge (both architectures)
```bm_mercaux```

##### 3) Upload cartridges to the cloud cartridge pool
*SFRA:*
```int_mercaux```

*SiteGenesis:* ```int_mercaux_sgjc_controllers, int_mercaux_sgjc```

*Business Manager:*
```bm_mercaux```

##### 4) Add cartridges to the cartridge path of Storefront Site Settings and Business Manager Settings
**SFRA:** ```int_mercaux```

1. Go to `Administration > Sites > Manage Sites > ${Your SFRA Site} >
   Settings tab`

2. Add `int_mercaux` to the Cartridge field value in the begin of line.
   
   Example:
   `int_mercaux:app_storefront_base`
   
3. Click `Apply` button to save changes


**SiteGenesis:** ```int_mercaux_sgjc_controllers```
```int_mercaux_sgjc```

1. Go to `Administration > Sites > Manage Sites > ${Your SiteGenesis
   Site} > Settings tab`

2. Add `int_mercaux_sgjc_controllers:int_mercaux_sgjc` to the Cartridge field value in the begin of
   line. 
   
   Example:
   `int_mercaux_sgjc_controllers:int_mercaux_sgjc:app_storefront_controllers:app_storefront_core`
   
3. Click `Apply` button to save changes

**Business Manager:** ```bm_mercaux``` 

1.) Go to `Administration > Sites > Manage Sites > Business Manager >
   Settings tab`

2.) Add `bm_mercaux` to the Cartridge field value in the end of the 
   line.

   Example: `bm_app_storefront_base:bm_custom_plugin:bm_mercaux`
   
3.) Click `Apply` button to save changes

##### 5) Import all necessary XML files of cartridges
To have all necessary configurations you should import all XML files that cartridges must use for proper work. 

There are files that should be imported:

##### Business Manager Site cartridge
1.) ```metadata/${RefArch||SiteGenesis}/jobs.xml```

The file contains Jobs configurations for Import Looks and Analytic logics. 
Please, before import change `<context site-id="RefArch"/>` context site-id to your current site where it should be imported.

By default Context Site ID value is `site-id="RefArch"` or `site-id="SiteGenesis"`

2.) ```metadata/${RefArch||SiteGenesis}/services.xml```

The file contains Service configurations to work with Mercaux API and
this service used in Jobs flow

3.)
```metadata/${RefArch||SiteGenesis}/meta/custom-objecttype-extensions.xml```

The file contains Custom-Object Type definitions to have the proper
configuration for Analytics.

---
##### Storefront Site cartridge SFRA (int_mercaux)

Default site of XML data files is: `RefArch`, make sure to change site
value to your existing site where cartridge going to import.

You can import fully ZIP archive with all required XML data and files, 
you can use Site Import feature in the BM.

Archive Path: `metadata/RefArch.zip`

Location in BM: `Administration > Site Development > Site Import &
Export`

Or import files separately:

1.) ```metadata/RefArch/meta/system-objecttype-extensions.xml```

Import System Object Type configurations that extend and add ones for using mercaux cartridge.

2.) ```metadata/RefArch/catalogs/storefront-catalog-m-en/catalog.xml```

Import Catalog file to create Category “Looks” that Job uses for import products and assign them to the imported category. Before import file, make sure to set up your storefront catalog ID that the current site uses. 

By default value is ```catalog-id="storefront-catalog-m-en"```

3.) ```metadata/RefArch/sites/RefArch/library/library.xml```

Import Content Assets configurations to enable/disable ability to show Looks Slider on the Product Detail Page. Before import file, make sure to have your library-id value based on Library that destination site uses. 

By default value is ```library-id="RefArchSharedLibrary"```

4.) ```metadata/RefArch/sites/RefArch/slots.xml```

Import Content Slot configurations to have abilities enable/disable Looks Slider on the home page. 

You would have warnings during the import slots as you should define
them in the codebase before import. Therefore, find below section in the
document: `Definition in the codebase - SFRA` -> `Define Looks Carousel
at the Homepage` and define slots tags under your homepage template
file.


---
##### Storefront Site cartridge SiteGenesis (int_mercaux_sgjc, int_mercaux_sgjc_controllers)

Default site of XML data files is: `SiteGenesis`, make sure to change site
value to your existing site where cartridge going to import.

You can import fully ZIP archive with all required XML data and files, 
you can use Site Import feature in the BM.

Archive Path: `metadata/SiteGenesis.zip`

Location in BM: `Administration > Site Development > Site Import &
Export`

Or import files separately:

1.) ```metadata/SiteGenesis/meta/system-objecttype-extensions.xml```

Import System Object Type configurations that extend and add ones for using mercaux cartridge.

2.) ```metadata/SiteGenesis/catalogs/storefront-catalog-en/catalog.xml```

Import Catalog file to create Category “Looks” that Job uses for import products and assign them to the imported category. Before import file, make sure to set up your storefront catalog ID that the current site uses. 

By default value is ```catalog-id="storefront-catalog-en"```

3.) ```metadata/SiteGenesis/sites/SiteGenesis/library/library.xml```

Import Content Assets configurations to enable/disable the ability to show Looks Slider on the Product Detail Page. Before import file, make sure to have your **library-id** value based on Library that destination site uses. 

By default value is ```library-id="SiteGenesisSharedLibrary"```

4.) ```metadata/SiteGenesis/sites/SiteGenesis/slots.xml```

Import Content Slot configurations to have abilities enable/disable Looks Slider on the home page.

You would have warnings during the import slots as you should define
them in the codebase before import. Therefore, find below section in the
document: `Definition in the codebase - SiteGenesis` -> `Define Looks
Carousel at the Homepage` and define slots tags under your homepage
template file.

## Setup cartridge in Business Manager
---
##### 1) Setup Service to work with Mercaux API
Go to the Services ```Administration > Operations > Services``` and find
recently imported Mercaux service named as ```int_mercaux_api_service```
.

You can go through settings of service ```int_mercaux_api_service``` to
setup additional settings for the service. 
 
Setup credentials via going to ```Credentials```: 

Select ```int_mercaux_api_service_creds``` credential item and put
actual information about API to use within cartridge. 

Such as **URL**, **Password** endpoint of API. Currently, service use
```https://dev-public-api.mercaux.com/1.0/api``` URL API endpoint. 

You may get an error while Job executing if there is any error with
provided creds happened. Make sure to check Log directory to identify
error message and etc.

Make sure that service is enabled and credentials settings have correct values.

##### 2) Update Searchable Attributes
Go to `Merchant Tools -> Search -> Searchable Attributes` and add one
more attribute as `manufacturerSKU` if that hadn’t added before.

Mercaux's Job uses this attribute to find products by SKU.

You will get an error under Logs section if your `manufacturerSKU` wasn't defined. 
Example of error: 

ErrorMessage: `Products with the SKUs from Response weren't found or
manufacturerSKU search refinement attribute wasn't defined.`

##### 3) Add Search Refinement to the Storefront Catalog
Go to your current storefront catalog of site and define one more Search Refinement value if there hasn’t been yet. 

Under the `Search Refinement Definitions` tab you should add new search refinement definition: 
1. Display name: `SKU`
2. AttributeID: `manufacturerSKU`

After these steps your ```manufacturerSKU``` refinement attribute will be added to the storefront catalog.
&nbsp;

##### 3.1) Run Reindex based on search attributes updates
1. Go to `Merchant Tools >  Search >  Search Indexes` page 
2. Click at the `Rebuild All` button to rebuild all indexes.

##### 4) Run Job to fetch Looks from Mercaux API
Go to the Jobs list page and select ```mercaux_Looks``` Jobs. 

You can have extra configuration based on tabs of the Job, but the main settings you can find in the ```Job Steps``` tab. 
&nbsp;
##### Main Job steps that need to work with import Mercaux Looks from Mercaux API:

- ***createXMLFile***

Contain functionality and configuration to generate XML files and collect them at the Impex folder. 

Config fields such as:
 
1. `CatalogID*` - ID of your current Master catalog

2. `StorefrontCatalogID*` - ID of your current Storefront catalog. Best
   practice of Catalog design is using both Master and Storefront
   catalogs, but you also could set your Master catalog ID to this
   field.
   
3. `CatalogImageBasePath*` - Image Base path value of your current
   Master catalog. That should be the same value as your current catalog
   has. See: {Edit your current catalog} -> Image Settings tab -> Base
   path field value.
   
4. `CategoryID*` - Category ID where generated Looks will be assigned.
   By default is "Looks".
   
5. `RootMercauxFolder*` - Root folder path where generated XML catalog
   with the looks where placed.

    
- ***Import***

Contain functionality to import generated catalog files and import them. 
There are configuration fields that you can edit based on your own site requirements.
    
- ***CleanArchiveFolder***

Contain functionality to keep the archive folder clean and has only a fixed amount of .zip files with the catalog files that have been imported.

- ***Reindex***

Before clicking `Run Now` make sure that you have successfully setup
proper Scope per each Job step. There is values that should be per each
Job Step:

1. **createXMLfile**: Scope is `Current Storefront Site`

2. **Import, CleanArchiveFolder** steps: Scope is `Organization`

3. **Reindex**: Scope is `Current Storefront Site`

After successfully Import step, Job runs Reindex step to update Search
Indexes based on catalog import.

##### 5) Enable/Disable Content Asset to show Looks Carousel on the PDP
Content Assets used to show/hide Looks Carousel slider on the PDP. 

After successfully import, you will able to find imported ***Content Asset ID*** - ```mercaux-pdp-slider-looks-content```. 

This content asset responsible for global configuration show/hides Looks Carousel on the PDP.

To globally Enable/Disable this content asset you should edit Content Asset and change option - ```Online``` to ***Yes/No*** and then apply changes.

##### 6) Enable/Disable Content Slot to show/hide Looks Carousel on the Homepage
Content Slots used to show/hide Looks Carousel on the homepage. 

After successfully import, go to  ```Merchant Tools -> Online Marketing -> Content Slots``` and you will able to find Mercaux's imported 

Content Slot  ID - ```homepage-mercaux-looks-slider```

***This content slot has two configurations:***

1.) ```homepage-looks-slider-category-block```

This slot configuration responsible for logic to show looks from the selected category. 
By default - ***Look*** category selected. 

Count of the Looks in the Slider from Category you can set up on the settings page ```(Merchant Tools -> Custom Preferences -> Mercaux Cartridge Settings)``` 
with the Number of Products in Slider Slot Category. field. By default value is 6.

2.) ```homepage-looks-slider-product-ids-block```

This slot configuration provides settings to show Looks Carousel based on selected Product Look IDs.
Some of the IDs already predefined by default. 

To have flexible ability between what type of configuration you need to show on the homepage, you should change statuses between them Active/Inactive as well.

Meanwhile, you are able to add configuration to the existing Content Slot that you have, 
just repeat move configuration of ```homepage-mercaux-looks-slider``` slot to the existing one.

##### 7) Looks Gallery page settings
1. Go to `Merchant Tools > Products and Catalogs > Catalogs`
2. Select storefront catalog that current site assigned for 
3. You should notice `Looks` category and select `Edit` link to go into
   Settings menu.

Under these settings you are able to configure Looks category based on
your own configurations and etc.

***FOR SFRA ONLY:***

An important value that needs to be set up to have properly working Looks Gallery page is ***Rendering Template*** field value.

The field of ***Rendering Template*** must be set to ```searchLooksGallery/searchResults.isml``` value. 

This template used for implementing logic to show Mercaux Looks Items on the Controller level and PLP logic of rendering templates.

##### 8) Mercaux Custom Preferences
1. Go to `Merchant Tools > Site Preferences`
2. Go under `Mercaux Cartridge Settings` settings page 

Mercaux Cartridge provides Custom Preferences definition. 

This definition will appear after as XML file of system object types
were imported.

***This page has a few fields:***

1.) ***Default Look Gallery page Category ID***

This value is important because all logic in the Controllers use this Category ID to check and append template value to render Mercaux’s templates only where it needs. 
By default value ID is ***Looks***. 

2.) ***Number of Products in Slider Slot Category***

The number of products to show in the Looks Carousel Slider for Content Slot with Category logic to show.

3.) ***Enable Cartridge Globally*** 

Turn on/off cartridge globally for all site and all places.
By default value is ***No***.

4.) ***Number of Products in the one search result in slots***

The number of product showed in one search result in the Content Slot templates to show sliders.
By default value is ***64***.

##### 9) Configure Recurring Interval of Analytic Job

After as Job files were imported, Analytic job configured to run every
1h for generating Analytic files. 

Before trigger "Run Now" button, you can change settings of Recurring
config in `MercauxAnalytic` job settings. 

- Go to your Analytic Job configuration (Administration -> Operations ->
  Jobs -> MercauxAnalytic -> Schedule and History tab)

- Under `Active` and `Run Time` you could see initial settings of run
  execution of job. You can configure by your own or leave as is. 
  
  You can read more about by link to the [DOC](https://documentation.b2c.commercecloud.salesforce.com/DOC2/index.jsp?topic=%2Fcom.demandware.dochelp%2FJobs%2FCreateJob.html)
  
You can also add using SFTP Uploader step (See section #10 below) or
just click `Run Job` button to start Analytic Job.


##### 10) SFTP configuration to upload Analytic files (Optional)

If you would like to upload your generated analytic `.XML` files, you
could setup one more job step based on 3rd party LINK cartridge `Job
Components`

1.) **Download and Install Job Components** LINK cartridge from the
   marketplace repository and install cartridge based on cartridge
   documentation.
   
   Repo link: 
   [https://github.com/SalesforceCommerceCloud/job-components](https://github.com/SalesforceCommerceCloud/job-components)

2.) **Setup your SFTP service configuration** (optional)

If you already has configured SFTP service you can skip this guide step. 

- Create your SFTP service profile (Doc link:
  [create web service profile](https://documentation.b2c.commercecloud.salesforce.com/DOC2/topic/com.demandware.dochelp/WebServices/CreateWebServiceProfile.html))

- Create your SFTP service credential (Doc link:
  [create web service credential](https://documentation.b2c.commercecloud.salesforce.com/DOC2/topic/com.demandware.dochelp/WebServices/CreateWebServiceCredential.html))

- Create your SFTP service configuration (Doc link:
  [create web service configuration](https://documentation.b2c.commercecloud.salesforce.com/DOC2/topic/com.demandware.dochelp/WebServices/CreateWebServiceConfig.html))
  
  In additional, one of important step of this setup that you should
  select Service Type and set as `SFTP`
  ([Read more about Service Types](https://documentation.b2c.commercecloud.salesforce.com/DOC2/topic/com.demandware.dochelp/WebServices/ServiceTypes.html))
  type and select profile and credential that you've created based on
  previous steps.
  
3.) **Add SFTP job step**.

- Go to your Analytic Job step configuration (Administration -> Operations
-> Jobs -> MercauxAnalytic -> Job Steps tab)

- Add one more sequential flow by clicking on `+` icon and click
  `Configure a step` to add one more Job step.
  
- If you successfully configured Job Components LINK cartridge type in
  search field `custom.CSComponents.FtpUpload` to find Job step that
  will be used for SFTP upload.

- Fill required fields based on configuration values. Short descriptions
  of fields: 
  
  -- `ID*` - Add your Job step ID
  
  -- `ServiceID*` - Put Service configuration ID of your existing SFTP
    service configuration or which you created based on **Setup your
    SFTP service configuration** step.
  
  -- `FilePattern` - Set regex pattern of files that should be uploaded.
    In our case value: `.+\.xml`
  
  -- `SourceFolder*` - Set Source folder where analytic files placed. In
    our case value: `src/mercaux/Analytics`
  
  -- `TargetFolder*` - Set your target folder on the SFTP server where
    files will be uploaded.
    
  -- `ArchiveFolder*` - Set Local folder where to archive files after as
    they will be uploaded on SFTP server, relative to IMPEX/. For
    example: `src/mercaux/Analytics/archive`
    
  You also could configure additional configuration of Job step and
  after when you're done click `Assign` button to save your step
  configuration. 
  
After these steps, your Analytic job will use SFTP step to upload your
analytic files to the SFTP server based on configuration.


## Definition in the codebase - SFRA
---
##### 1)  Define Global File Assets in current base cartridge that site uses
Path: ```${your_current_storefront_cartridge}/cartridge/templates/default/common/layout/page.isml#4```
Before the tag:

```
<isinclude template="/components/modules" sf-toolkit="off" />
```
Insert the code below:
```
<iscomment> Mercaux Assets Files </iscomment> 
<isif condition="${dw.system.Site.current.preferences.custom.mercaux_GlobalEnableStatus}">
<isinclude template="aseetsMercaux/assetsFiles" /> 
</isif>
```

##### 1.1)  Download and add all required libs to use Mercaux Cartridge
- Owl Carousel v. 2.3.4 [Link to download](https://owlcarousel2.github.io/OwlCarousel2/)

After as all required libs were downloaded: 
1. Go to the `int_mercaux/cartridge/templates/default/aseetsMercaux/assetsFiles.isml`
2. Uncomment and provide paths to the OWL Carousel files under static folder, make sure that downloaded files are minified.

``` 
<isscript>
    ... 
    // JSs 
    // OWL Carousel minified source (v 2.3.4) file connect below
    // assets.addJs('/js/${your_libs_folder_in_static}/owl.carousel.min.js');
    ... 

    // CSSs 
    // OWL Carousel minified CSS files (v 2.3.4) connect below 
    // assets.addCss('/css/YOUR_LIBS_FOLDER/owl/owl.carousel.min.css');
    // assets.addCss('/css/YOUR_LIBS_FOLDER/owl/owl.theme.default.min.css');
    ...  
</isscript>
``` 
##### 1.2)  Define Analytic Tag in the current footer template file

Path:
`${your_current_storefront_cartridge}/cartridge/templates/default/common/layout/components/footer/pageFooter.isml#34`

In the end of the current file `pageFooter.isml`, after closing `<footer
id="footercontent"></footer>` tag, add the `Mercaux Analytic Tag`.

Insert the code below:
```
<!-- Mercuax Analytic tag **** start -->
<span class="js-mercaux-analytics-tag" data-mercaux-analytics-url="${URLUtils.url('Analytics-Add')}"></span>
<!-- Mercuax Analytic tag **** end -->
```


Example of full code in the `pageFooter.isml` template file: 

```
<footer id="footercontent">
    ... DEFAULT/CUSTOM code of footer block ...
</footer>

<!-- Mercuax Analytic tag **** start -->
<span class="js-mercaux-analytics-tag" data-mercaux-analytics-url="${URLUtils.url('Analytics-Add')}"></span>
<!-- Mercuax Analytic tag **** end -->
```

##### 2)  Looks Gallery PLP page
Template that used for PLP page located in cartridge path:
```int_mercaux/cartridge/templates/default/searchLooksGallery/searchResults.isml```

Refinements blocks and functionalities work based on current storefront cartridge configurations.
If you would like to add ***Selected Refinement*** block, you should extend the logic of the client's JS code and add one more selector that used in `int_mercaux`.
1. Go to the file where placed logic of PLP client's 

Path:
```${your_current_storefront_cartridge}/cartridge/client/default/js/search/search.js#38```
2. Add one more selector ```'.looks-top-selected-refinements’``` to the ```parseResults()``` method.    
```
    function parseResults(response) {
        var $results = $(response);
        var specialHandlers = {
            '.refinements': handleRefinements
        };
         
        // Update DOM elements that do not require special handling
        [
            '.looks-top-selected-refinements',
            '.grid-header',
            '.header-bar',
            '.header.page-title',
            '.product-grid',
            '.show-more',
            '.filter-bar'
        ].forEach(function (selector) {
            updateDom($results, selector);
        });
    
        Object.keys(specialHandlers).forEach(function (selector) {
            specialHandlers[selector]($results);
        });
    }
```
At the end of all, to make this working you have to re-compile the client’s js code of your own base patch cartridge.

##### 3)  Define Looks Carousel at the Product Detail Page
We replaced the template of the Product Detail page with adding some part of code to have ability show Looks Carousel somewhere at the page and keep that file in the templates of the cartridge as well. 

You can replace own Product Detail template based on your current site template and define code below:


1. ***Mercaux Slider content slot***

Path: ```${your_current_storefront_cartridge}/cartridge/templates/default/product/productDetails.isml```


Code:
```
<isinclude url="${URLUtils.url('Mercaux-IncludeSlider', 'cid', 'mercaux-pdp-slider-looks-content', 'pid', product.id)}" />
```
2. ***Mercaux Shop the Button***

By default, `int_mercaux` cartridge replaces default template
`product/components/addToCartProduct.isml` file with extending by adding
`Shop the Look` button next to `Add to Cart` button. 

You can leave as is
or add code with button definition directly to your current
storefront template.


Go to the file template path:
`${your_current_storefront_cartridge}/cartridge/templates/default/default/product/components/addToCartProduct.isml`


Add the code definition of the `Shop the Look` button:
``` 
<isif condition="${dw.system.Site.current.preferences.custom.mercaux_GlobalEnableStatus}">
<!-- Mercuax Shop The Look button **** start -->
<div class="shop-the-look-btn js-insert-shop-the-look-btn" data-btn-text="SHOP THE LOOK"></div>
<!-- Mercuax Shop The Look button  **** end -->
</isif>
```
 
Full example code of `addToCartProduct.isml` template with the added
button:
```
<div class="row cart-and-ipay">
    <div class="col-sm-12">
        <input type="hidden" class="add-to-cart-url" value="${pdict.addToCartUrl}">
        <button class="add-to-cart btn btn-primary js-add-to-bag-button"
                data-product-sku="${product.sku || null}" 
                data-toggle="modal" data-target="#chooseBonusProductModal"
                data-pid="${product.id}"
                ${!product.readyToOrder || !product.available ? "disabled" : ""}>
            <i class="fa fa-shopping-bag"></i>
            ${Resource.msg('button.addtocart', 'common', null)}
        </button>

        <isif condition="${dw.system.Site.current.preferences.custom.mercaux_GlobalEnableStatus}">
            <!-- Mercuax Shop The Look button **** start -->
            <div class="shop-the-look-btn js-insert-shop-the-look-btn" data-btn-text="${Resource.msg('button.shopthelook', 'int_mercaux_common', null)}"></div>
            <!-- Mercuax Shop The Look button  **** end -->
        </isif>
    </div>
</div>
```

##### 4)  Define Looks Carousel at the Homepage
To enable showing Looks Carousel at the home page, 
you should define content slot definition at the place somewhere of the Homepage template. 


You can put a content slot that was imported along with the XML import
step.

```<isslot id="homepage-mercaux-looks-slider" description="" context="global" />```

For example path of homepage template and example HTML to paste:
`cartridges/app_storefront_base/cartridge/templates/default/home/homePage.isml`


```
<div class="container">
    <div class="row">
        <div class="col-12">
            <!-- Mercaux Slot START -->
            <isslot id="homepage-mercaux-looks-slider" description="" context="global" />
            <!-- Mercaux Slot END -->
        </div>
    </div>
</div>
```


If you have had already defined the content slot, just add make sure that proper configurations of Mercaux Content Slot:
- `homepage-looks-slider-category-block` - Show slider with Category logic
- `homepage-looks-slider-product-ids-block` - Show slider with predefined Product IDs logic


## Definition in the codebase - SiteGenesis
---
##### 1)  Define Global File Assets in current base cartridge that site uses

1. ***Mercaux JS files***

Location: ```${your_current_storefront_cartridge}/cartridge/templates/default/components/footer/footer_UI.isml#30```
```
<isif condition="${dw.system.Site.getCurrent().getCustomPreferenceValue('mercaux_GlobalEnableStatus')}">
<!-- Mercaux JS Assets Include -->
<span class="js-mercaux-analytics-tag" data-mercaux-analytics-url="${URLUtils.url('Analytics-Add')}"></span>
<script defer src="${URLUtils.staticURL('/js/mercauxApp.js')}"></script>
</isif>
```

1.1 ***Define JS required that use along with Mercaux Cartridge*** 

Download owl carousel files: Owl Carousel v. 2.3.4 [Link to download](https://owlcarousel2.github.io/OwlCarousel2/) 

Place the file `owl.carousel.min.js` to your static folder somewhere under JS directory:

Example:  `static/default/js/YOUR_NAME_LIBS_FOLDER/owl.carousel.min.js` 

Add `<script defer src="${URLUtils.staticURL('/js/YOUR_NAME_LIBS_FOLDER/owl.carousel.min.js')}"></script>`
after `<span class="js-mercaux-analytics-tag" />` tag. 

Location: ```${your_current_storefront_cartridge}/cartridge/templates/default/components/footer/footer_UI.isml#30```

Example final code: 

```
<isif condition="${dw.system.Site.getCurrent().getCustomPreferenceValue('mercaux_GlobalEnableStatus')}">
<!-- Mercaux JS Assets Include -->
<span class="js-mercaux-analytics-tag" data-mercaux-analytics-url="${URLUtils.url('Analytics-Add')}"></span>
<script defer src="${URLUtils.staticURL('/js/YOUR_NAME_LIBS_FOLDER/owl.carousel.min.js')}"></script>
<script defer src="${URLUtils.staticURL('/js/mercauxApp.js')}"></script>
</isif>

```

2. ***Mercaux CSS files***

Location: ```${your_current_storefront_cartridge}/cartridge/templates/default/components/header/htmlhead.isml#83```
```
<isif condition="${dw.system.Site.getCurrent().getCustomPreferenceValue('mercaux_GlobalEnableStatus')}">
<!-- Mercaux CSS Assets Include -->
<link rel="stylesheet" href="${URLUtils.staticURL('/css/mercauxStyles.css')}" />
</isif>
```

1.1 ***Define CSS required libs files that use along with Mercaux Cartridge*** 

Download owl carousel files: Owl Carousel v. 2.3.4 [Link to download](https://owlcarousel2.github.io/OwlCarousel2/) 
 
Place files `owl.carousel.min.css`, `owl.theme.default.min.css` to your static folder somewhere under CSS directory:

Location: ```${your_current_storefront_cartridge}/cartridge/templates/default/components/header/htmlhead.isml#83```

Example:  
`static/default/css/YOUR_NAME_LIBS_FOLDER/owl.carousel.min.css` 
`static/default/css/YOUR_NAME_LIBS_FOLDER/owl.theme.default.min.css`

Add link tags to connect styles of the libs to the page:

`<link rel="stylesheet" href="${URLUtils.staticURL('/css/YOUR_NAME_LIBS_FOLDER/owl.carousel.min.css')}" />`

`<link rel="stylesheet" href="${URLUtils.staticURL('/css/YOUR_NAME_LIBS_FOLDER/owl.theme.default.min.css')}" />` 

To the next location: `${your_current_storefront_cartridge}/cartridge/templates/default/components/header/htmlhead.isml#83`

Example final code: 
```
<isif condition="${dw.system.Site.getCurrent().getCustomPreferenceValue('mercaux_GlobalEnableStatus')}">
<!-- Mercaux CSS Assets Include -->
<link rel="stylesheet" href="${URLUtils.staticURL('/css/YOUR_NAME_LIBS_FOLDER/owl.carousel.min.css')}" />
<link rel="stylesheet" href="${URLUtils.staticURL('/css/YOUR_NAME_LIBS_FOLDER/owl.theme.default.min.css')}" />
<link rel="stylesheet" href="${URLUtils.staticURL('/css/mercauxStyles.css')}" />
</isif>
```
 

##### 2)  Define Hooks into Controllers of the current base cartridge that site uses to have the logic on PLP page for Looks Gallery

Path: `${your_current_cartridge_controllers}/cartridge/controllers/Product.js`


1. ***Method: `hitTile()`***

Controller URL: `Product~hitTile`

```
//  Mercaux Controller Logic ---- Start
var HookMgr = require('dw/system/HookMgr');  
var isHookExecuted = HookMgr.callHook('mercaux.plp.looks.tile', 'renderProductTile', { params: params, productView: productView });
if (isHookExecuted) return;
// Mercaux Controller Logic ---- End
```
You must define hook before calling `render` method.

```
productView.render(product.getTemplate() || 'product/producttile');
```
Example of final code:

```
function hitTile() {

        // ..... rest code above .......

        productView.product = product.object;
 
        //  Mercaux Controller Logic ---- Start
        var HookMgr = require('dw/system/HookMgr');  
        var isHookExecuted = HookMgr.callHook('mercaux.plp.looks.tile', 'renderProductTile', { params: params, productView: productView });
        if (isHookExecuted) return;
        // Mercaux Controller Logic ---- End

        productView.render(product.getTemplate() || 'product/producttile');
    }

}
```

2. ***Method: `variation()`***

Controller URL: `Product~variation`

```
        //  Mercaux Controller Logic ---- Start
        var HookMgr = require('dw/system/HookMgr'); 
        var objArgs = { 
            params: params, 
            app: app, 
            product: product, 
            resetAttributes: resetAttributes, 
            currentVariationModel: currentVariationModel 
        }
        var isHookExecuted = HookMgr.callHook('mercaux.modal.variation.filters', 'renderVariationInModal', objArgs); 
        if (isHookExecuted) return;
        // Mercaux Controller Logic ---- End
```

You must define hook before calling `render` method.

Example of final code:

```
function variation() {

    // ..... rest code above .......

    if (product.isVisible()) { 
        
        //  Mercaux Controller Logic ---- Start
        var HookMgr = require('dw/system/HookMgr'); 
        var objArgs = { 
            params: params, 
            app: app, 
            product: product, 
            resetAttributes: resetAttributes, 
            currentVariationModel: currentVariationModel 
        }
        var isHookExecuted = HookMgr.callHook('mercaux.modal.variation.filters', 'renderVariationInModal', objArgs); 
        if (isHookExecuted) return;
        // Mercaux Controller Logic ---- End
  
        if (params.source.stringValue === 'bonus') {
            const Cart = app.getModel('Cart');
            const bonusDiscountLineItems = Cart.get().getBonusDiscountLineItems();
            let bonusDiscountLineItem = null;

        // ..... rest code below .......
}
``` 

3. ***Method: `getSetItem()`***

Controller URL: `Product~getSetItem`

```
        //  Mercaux Controller Logic ---- Start
        var HookMgr = require('dw/system/HookMgr'); 
        var objArgs = {
            product: product,
            CurrentVariationModel: currentVariationModel,
            isSet: true,
            params: params,
            app: app
        }
        var isHookExecuted = HookMgr.callHook('mercaux.modal.variation.tile.parentModal', 'renderVariationInParentModal', objArgs); 
        if (isHookExecuted) return;
        // Mercaux Controller Logic ---- End
```

You must define hook before calling `render` method.

Example of final code:

```
function getSetItem() {

    // ..... rest code above .......

    if (product.isVisible()) {
        //  Mercaux Controller Logic ---- Start
        var HookMgr = require('dw/system/HookMgr'); 
        var objArgs = {
            product: product,
            CurrentVariationModel: currentVariationModel,
            isSet: true,
            params: params,
            app: app
        }
        var isHookExecuted = HookMgr.callHook('mercaux.modal.variation.tile.parentModal', 'renderVariationInParentModal', objArgs); 
        if (isHookExecuted) return;
        // Mercaux Controller Logic ---- End

        app.getView('Product', {
            product: product,
            CurrentVariationModel: currentVariationModel,
            isSet: true
        }).render('product/components/productsetproduct');
    } else {

    // ..... rest code below .......
}
``` 

##### 3)  Define Looks Carousel at the Product Detail Page
We replaced the template of the Product Detail page with adding some part of code to have the ability show Looks Carousel somewhere at the page and keep that file in the templates of the cartridge as well. 

You can replace own Product Detail template based on your current site template and define code below:

1. ***Mercaux Slider content slot***

Path: ```${your_current_storefront_cartridge}/cartridge/templates/default/product/producttopcontent.isml```

Code:
```
<isinclude url="${URLUtils.url('Mercaux-IncludeSlider', 'cid', 'mercaux-pdp-slider-looks-content', 'pid', pdict.Product.ID)}" />
```

2. ***Mercaux Shop the Button***

Path: ```${your_current_storefront_cartridge}/cartridge/templates/default/product/producttopcontent.isml```

Code:
```
<isif condition="${dw.system.Site.getCurrent().getCustomPreferenceValue('mercaux_GlobalEnableStatus')}">
<div class="shop-the-look-btn js-insert-shop-the-look-btn" data-slider-id="SliderLooksCarousel">
	<a href="#SliderLooksCarousel" class="btn-primary">SHOP THE LOOK</a>				
</div> 
</isif>
```


##### 4)  Define Look Modal at PLP search template
To enable showing Looks Popup modal at the search page (PLP), you should
add `isinclude` tag to include Modal Popup template. 

Put the next code definition before clothing `</body>` tag in the
`app_storefront_core/cartridge/templates/default/search/pt_productsearchresult.isml`
file.

Code to insert:
```
<!-- Mercaux Modal START -->
<isinclude template="modal/baseModal"/>
<!-- Mercaux Modal END --> 
```

##### 5)  Define Looks Carousel at the Homepage
To enable showing Looks Carousel at the home page, 
you should define content slot definition at the place somewhere of the Homepage template. 


You can put content slot that was imported along with XML import step:
```<isslot id="homepage-mercaux-looks-slider" description="" context="global" />```


For example path of homepage template and example HTML to paste:
`app_storefront_core/cartridge/templates/default/content/home/homepage.isml`


```
<div class="home-bottom-slots"> 
    <!-- Mercaux Slot START -->
    <isslot id="homepage-mercaux-looks-slider" description="" context="global" />
    <!-- Mercaux Slot END -->
    
   <!-- ... Rest of code below ... -->
</div>
```


If you have had already defined the content slot, just add make sure that proper configurations of Mercaux Content Slot:

- `homepage-looks-slider-category-block` - Show slider with Category logic
- `homepage-looks-slider-product-ids-block` - Show slider with predefined Product IDs logic

## Development Guide for Business Manager cartridge:
---

##### 1) Additional filters of selecting product from service response 

In addition, you would have one more filters based on Jobs scripts
import and provide additional conditions and rules for passing Look into
SFCC database.

You could do that under `productUtils.js` file. This file contain logic to generate model that will be used for XML 
file population

Location: `bm_mercaux/cartridge/scripts/helpers/productUtils.js#24` 

Inside of `searchProductsBySKU()` method, on 24 line you would setup additional filter params:

```
...

var assignedProductsIDs = []; 

// Filter conditions to skip looks based on diff criteria:

// 1. Skip looks without "status: activeObject"

// if (product.status !== "activeObject") { 
//     continue;
// }

var skuArray = product.products.map(function (productSetProduct) {
    return productSetProduct.sku;
});
        
...
```

So as you can see, when we go into `if` statement and when `continue` executes, 
we skip current loop step and go to the next one. 

You would have different filter statements based on you logic and requirements.

##### 2) Edit search attribute in the SFCC database where products lookup produces with response look SKUs. 

By default Search in the Job script performs search products in the
Commerce Cloud site by `manufacturerSKU`. But you can change logic and
replace search attribute for example to `ProductID`.

File location: `bm_mercaux/cartridge/scripts/helpers/productUtils.js`

Line 31: Prepare data for search query by response mapping
```
// Helper mapping to format data to the formatted query value 
var skuArray = product.products.map(function (productSetProduct) { 
    return productSetProduct.sku; 
}); 
```

Line 35: Building format query value for Search function.
```
// Search query format that performs search and pass to the function
var formattedSearchQuery = skuArray.reduce(function (prev, currentValue, index, array) {
    var line = array[index + 1] ? '|' : '';
        return prev + currentValue + line;
}, '');
```

Line 42: Replace the first argument of `searchByRefinement()` function
along with your search attribute name. Don't forget to make this
attribute `searchable` in the setting of the catalog.
```
// Function that executes search by attribute and matched products add to the Look ProductSet. By default is 'manufacturerSKU'
var searchResultBySKU = searchByRefinement('manufacturerSKU', formattedSearchQuery);
```

Update logic of `searchByRefinement()` function to have your own logic
of mapping search result data based on added new search attribute. 

File location:
`bm_mercaux/cartridge/scripts/helpers/searchByRefinement.js#27`


Line 75: Mapping values based on data form variable `filteredProducts`
that contains all search result data. 
```
var mappedSKUsProduct = filteredProducts.map(function (searchResultObj) {
        var producSearchtHit = searchResultObj.productSearchHit;
        var product = producSearchtHit.getProduct();
        var hitType = producSearchtHit.getHitType();
        
        ... YOUR OWN HANDLING LOGIC BELOW ... 
        

    });
```



## Development Guide for SiteGenesis cartridge:
---
Developers also are able to modify cartridge based on their own requirements for each site.
In this guide, we will take base places of files and processes that developers would modify/update cartridge.
But the best way to customize the cartridge it's using the LINK cartridge approach to customize existing code based on the Documentation guide. 
[SGJC Overview](https://documentation.b2c.commercecloud.salesforce.com/DOC1/index.jsp?topic=%2Fcom.demandware.dochelp%2FSGJC%2FSiteGenesisDevelopmentOverview.html&cp=0_5_18) 

##### 1)  Client Side Scripts/Styles
All client’s side code (js scripts, css styles) was located in two folders:

1. ```int_mercaux_sgjc/cartridge/static``` 

This folder contains already compiled static files for ready to use them at the site.

2. ```int_mercaux_sgjc/cartridge/js, ```
    ```int_mercaux_sgjc/cartridge/scss```

This folder contains sources of scripts/styles that would be used for editing/modification styles and scripts based on requirements of the site that were used for. 
To have an updated static file, you make sure that all files were compiled successfully.

##### 2) Templates files that use with Mercaux Cartridge
1. ***Modal Popup***

```int_mercaux_sgjc/cartridge/templates/default/modal```

This folder contains templates used for modal popup structure and logic. 
Also, subfolders contain an individual template for product tiles of parent Look modal and child detail product of Modal.

2. ***ProductTile of Looks Gallery (PLP)***

```int_mercaux_sgjc/cartridge/templates/default/looksGallery/```

This folder contains templates that use for the ProductTile block of the Looks Gallery page.

3. ***Looks Carousel Slider***

```int_mercaux_sgjc/cartridge/templates/default/slider```

This folder contains logic and templates for rendering slider carousel.

4. ***Homepage Content Slots of Looks Carousel***

```int_mercaux_sgjc/cartridge/templates/default/slots```

This folder contains sources and logic for implementing Looks Carousel slider at the homepage.


## Development Guide for SFRA cartridge:
---
Developers also are able to modify cartridge based on their own requirements for each site.
In this guide, we will take base places of files and processes that developers would modify/update cartridge.

But the best way to customize the cartridge it's using the LINK cartridge approach to customize existing code based on the Documentation guide. 
[SFRA Overview](https://documentation.b2c.commercecloud.salesforce.com/DOC1/index.jsp?topic=%2Fcom.demandware.dochelp%2FSFRA%2FSFRAOverview.html&anchor=SFRAOverview) 

##### 1)  Client Side Scripts/Styles
All client’s side code (js scripts, css styles) was located in two folders:

1. ```int_mercaux/cartridge/static``` 

This folder contains already compiled static files for ready to use them at the site.

2. ```int_mercaux/cartridge/client/js, ```
    ```int_mercaux/cartridge/client/scss```

This folder contains sources of scripts/styles that would be used for editing/modification styles and scripts based on requirements of the site that were used for. 
To have an updated static file, you make sure that all files were compiled successfully.

##### 2) Templates files that use with Mercaux Cartridge
1. ***Modal Popup***

```int_mercaux/cartridge/templates/default/modal```

This folder contains templates used for modal popup structure and logic. 
Also, subfolders contain an individual template for product tiles of parent Look modal and child detail product of Modal.

2. ***ProductTile of Looks Gallery (PLP)***

```int_mercaux/cartridge/templates/default/product/lookSet```

This folder contains templates that uses for ProductTile block of Looks 
Gallery page.

3. ***Looks Gallery (PLP)***

```int_mercaux/cartridge/templates/default/searchLooksGallery```

This folder contains all templates that used for Looks Gallery page ( PLP )

Main entrypoint file of all templates is:

```int_mercaux/cartridge/templates/default/searchLooksGallery/searchResults.isml```

This template uses for settings of Rendering Template in the Looks category settings of Business Manager. 

4. ***Looks Carousel Slider***

```int_mercaux/cartridge/templates/default/slider```

This folder contains logic and templates for rendering slider carousel.

5. ***Homepage Content Slots of Looks Carousel***

```int_mercaux/cartridge/templates/default/slots```

This folder contains sources and logic for implementing Looks Carousel slider at the homepage.
