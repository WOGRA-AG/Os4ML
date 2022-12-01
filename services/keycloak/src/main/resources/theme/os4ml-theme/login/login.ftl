<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=social.displayInfo; section>
    <#if section = "form">
        <#if realm.password>
            <div class="flex-container flex-direction-row">
                <div class="row">
                    <div class="flex-item">
                        <div class="login-container-left">
                            <div class="logo-wogra">
                                <img src="${url.resourcesPath}/img/os4ml/logo-wogra.svg" alt="logo-wogra">
                            </div>
                            <div class="flex-container flex-direction-row">
                                <div class="row">
                                    <div class="flex-item">
                                        <div class="illustration-os4ml">
                                            <img src="${url.resourcesPath}/img/os4ml/illustration-os4ml.svg" alt="illustration-os4ml">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="flex-item">
                        <div class="login-container-right">
                            <div class="flex-container">
                                <div id="login-container-items" class="row">
                                    <div class="flex-item login-center padding-15">
                                        <h5>
                                            ${msg("welcome")}
                                        </h5>
                                    </div>
                                    <#if message?has_content>
                                        <div class="${properties.kcFeedbackAreaClass!}">
                                            <div class="alert alert-${message.type}">
                                                <#if message.type = 'success'><span class="${properties.kcFeedbackSuccessIcon!}">${message.summary}</span></#if>
                                                <#if message.type = 'warning'><span class="${properties.kcFeedbackWarningIcon!}">${message.summary}</span></#if>
                                                <#if message.type = 'error'><span class="${properties.kcFeedbackErrorIcon!}">${message.summary}</span></#if>
                                                <#if message.type = 'info'><span class="${properties.kcFeedbackInfoIcon!}">${message.summary}</span></#if>
                                            </div>
                                        </div>
                                    </#if>
                                    <form id="kc-form-login" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">
                                        <div class="flex-item padding-15">
                                            <label class="pure-material-textfield-outlined width-full">
                                                <input required id="username" class="mdc-text-field__input ${properties.kcInputClass!}" name="username" value="${(login.username!'')}" type="text" autofocus autocomplete="off" placeholder=" " <#if usernameEditDisabled??>disabled</#if>>
                                                <span>${msg("username")}</span>
                                            </label>
                                        </div>
                                        <div class="flex-item padding-30">
                                            <label class="pure-material-textfield-outlined width-full">
                                                <input required id="password" class="mdc-text-field__input ${properties.kcInputClass!}" name="password" type="password" autocomplete="off" placeholder=" ">
                                                <span>${msg("password")}</span>
                                            </label>
                                        </div>
                                        <div class="flex-item padding-30">
                                            <div class="flex-container login-sign-in-row">
                                                <div class="row">
                                                    <div class="flex-item">
                                                        <label class="pure-material-checkbox">
                                                            <input type="checkbox"
                                                                   name="rememberMe"
                                                                   class="mdc-checkbox__native-control"
                                                                   id="rememberMe"
                                                                   <#if login.rememberMe??>checked</#if>/>

                                                            <span>${msg("rememberMe")}</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="flex-item">
                                                        <a style="display: none;" href="${url.loginResetCredentialsUrl}">${msg("doForgotPassword")}</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex-item login-center padding-15">
                                            <button class="btn ${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonLargeClass!}" name="login" id="kc-login" type="submit">
                                                <span>${msg("doLogIn")}</span>
                                            </button>
                                        </div>
                                        <div style="display: none;" class="flex-item login-center padding-30">
                                            <a id="os4ml-register" href="#password"><a href="${url.registrationUrl}">${msg("doRegister")}</a></a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </#if>
    </#if>
</@layout.registrationLayout>
