<#macro registrationLayout bodyClass="" displayInfo=false displayMessage=true>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" class="${properties.kcHtmlClass!}">

<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="robots" content="noindex, nofollow">
    <meta name="viewport" content="width=device-width,initial-scale=1">

    <#if properties.meta?has_content>
        <#list properties.meta?split(' ') as meta>
            <meta name="${meta?split('==')[0]}" content="${meta?split('==')[1]}"/>
        </#list>
    </#if>
    <title><#nested "title"></title>
    <link rel="shortcut icon" href="${url.resourcesPath}/img/favicon.ico" />
    <#if properties.styles?has_content>
        <#list properties.styles?split(' ') as style>
            <link href="${url.resourcesPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
    <#if properties.scripts?has_content>
        <#list properties.scripts?split(' ') as script>
            <script src="${url.resourcesPath}/${script}" type="text/javascript"></script>
        </#list>
    </#if>
    <#if scripts??>
        <#list scripts as script>
            <script src="${script}" type="text/javascript"></script>
        </#list>
    </#if>
</head>

<body class="${properties.kcBodyClass!} template">
    <div id="kc-logo"><a href="${properties.kcLogoLink!'#'}"><div id="kc-logo-wrapper"></div></a></div>

    <div id="kc-container" class="${properties.kcContainerClass!}">
        <div id="kc-container-wrapper" class="${properties.kcContainerWrapperClass!}">

            <div id="kc-header" class="${properties.kcHeaderClass!}">
                <div id="kc-header-wrapper" class="${properties.kcHeaderWrapperClass!}"><#nested "header"></div>
            </div>

            <div id="kc-content" class="mdc-card ${properties.kcContentClass!}">
                <div id="kc-content-wrapper" class="${properties.kcContentWrapperClass!}">
                    <div id="kc-form" class="${properties.kcFormAreaClass!}">
                        <div id="kc-form-wrapper" class="${properties.kcFormAreaWrapperClass!}">
                            <#nested "form">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
</#macro>
