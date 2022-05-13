<template>
  <div
    id="app"
    style="margin-top: 0"
  >
    <dashboard>
      <!-- <template slot="header-dropdown-menu">
        <a
          href="#"
          class="dropdown-item"
        >
          Foobar
        </a>
      </template> -->

      <template slot="login-right">
        <div class="columns is-centered">
          <div class="column is-half">
            <img src="./assets/MicrosoftTeams-image.png">
            <a
              href="http://localhost:8082"
              class="button is-fullwidth is-primary"
              target="blank"
            >
              Public Content
            </a>
          </div>
        </div>
      </template>
    </dashboard>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>
<style lang="scss">
$x: #1f2128;
$x-light: lighten($x, 5%);
$y: #dddddf;
$y-dark: darken($y, 5%);

.section {
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  > .title {
    margin-bottom: 0rem!important;
    > .subtitle {
      margin-bottom: 0!important;
    }
  }
}

.table {
  background-color: #fff;
  color: #363636;
  td, th {
    border: 1px solid #dbdbdb;
    border-width: 0 0 1px;
    padding: .5em .75em;
    vertical-align: top;
  }
  thead {
    background-color: transparent;
    td, th {
      border-width: 0 0 2px;
      color: #363636;
    }
  }
  &.is-fullwidth {
    width: 100%;
  }
  &.is-striped {
    tbody {
      tr:nth-child(even) {
        background-color: #f0f1fa;
      }
    }
  }
  &.is-narrow {
    td, th {
      padding: .25em .5em;
    }
  }
}

.is-square {
  border-radius: 0!important;
  border: 1px solid rgba(255, 255, 255, .5);
}

.switch[type=checkbox] {
  &+label {
    display: inline-flex;
    padding-top: 0;
    line-height: 1.875rem;
    padding-left: 4.5rem;

    &:before {
      height: 1.875rem;
      width: 4rem;
    }

    &:after {
      height: 1.35rem;
      width: 1.35rem;
    }
  }

  &:checked+label {
    &:after {
      left: 2.4rem;
    }
  }
}

.input--simple {
  padding: .25em 0;
  font-size: 1rem;
  width: 100%;
  border: none;
  outline: none;
  box-shadow: none;
  border-bottom: 1px dashed #bbb;
  background-color: transparent!important;

  .dashboard.is-dark & {
    color: $y;
    border-color: lighten($x-light, 20%);
  }

  &:focus {
    border: none;
    outline: none;
    box-shadow: none;
  }

  &.is-small {
    font-size: .75rem;
  }
}

.is-color-blue {
  $color: #004085;
  $bg: #cce5ff;

  color: $color!important;
  background-color: $bg!important;
  border-color: darken($bg, 10%)!important;

  .box__header {
    border-color: darken($bg, 10%)!important;
  }

  .input--simple,
  .button.is-text {
    color: $color!important;
  }

  .popover__ref .button {
    color: $color!important;
    background-color: darken($bg, 10%)!important;
    border-color: darken($bg, 15%)!important;
  }
}

.is-color-green {
  $color: #155724;
  $bg: #d4edda;

  color: $color!important;
  background-color: $bg!important;
  border-color: darken($bg, 10%)!important;

  .box__header {
    border-color: darken($bg, 10%)!important;
  }

  .input--simple,
  .button.is-text {
    color: $color!important;
  }

  .popover__ref .button {
    color: $color!important;
    background-color: darken($bg, 10%)!important;
    border-color: darken($bg, 15%)!important;
  }
}

.is-color-yellow {
  $color: #856404;
  $bg: #fff3cd;

  color: $color!important;
  background-color: $bg!important;
  border-color: darken($bg, 15%)!important;

  .box__header {
    border-color: darken($bg, 15%)!important;
  }

  .input--simple,
  .button.is-text {
    color: $color!important;
  }

  .popover__ref .button {
    color: $color!important;
    background-color: darken($bg, 15%)!important;
    border-color: darken($bg, 20%)!important;
  }
}

.is-color-red {
  $color: #721c24;
  $bg: #f8d7da;

  color: $color!important;
  background-color: $bg!important;
  border-color: darken($bg, 10%)!important;

  .box__header {
    border-color: darken($bg, 10%)!important;
  }

  .input--simple,
  .button.is-text {
    color: $color!important;
  }

  .popover__ref .button {
    color: $color!important;
    background-color: darken($bg, 10%)!important;
    border-color: darken($bg, 15%)!important;
  }
}

.is-color-teal {
  $color: #0c5460;
  $bg: #d1ecf1;

  color: $color!important;
  background-color: $bg!important;
  border-color: darken($bg, 10%)!important;

  .box__header {
    border-color: darken($bg, 10%)!important;
  }

  .input--simple,
  .button.is-text {
    color: $color!important;
  }

  .popover__ref .button {
    color: $color!important;
    background-color: darken($bg, 10%)!important;
    border-color: darken($bg, 15%)!important;
  }
}

.dashboard.is-dark {
  .vs__search {
    color: darken($y, 15%);
  }

  .vs__actions {
    svg {
      fill: darken($y, 15%);
    }
  }
}

::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.stepper {
  display: flex;
  width: 100%;
  padding-bottom: 1rem;
}
.stepper-item {
  display: inline-block;
  width: 50%;
  cursor: pointer;
  border-bottom-width: 5px;
  border-bottom-style: solid;
  border-bottom-color: #8a8a8a;
  text-align: center;
  .steper-header {
    color: #8a8a8a;
    font-weight: bolder;
  }
}

.stepper-done {
  border-bottom-color: #3298dc;
  .steper-header {
    color: #3298dc;
  }
}

.stepper-active {
  border-bottom-color: #3273dc;
  .steper-header {
    color: #3273dc;
  }
}
.lable-inline {
  padding: 0.2rem;
}
.field-line {
  width: 100%;
  padding: 0.2rem 0.2rem .75rem 0.2rem;
  display: flex;
}

.field-2 {
  width: 50%;
  padding-right: 0.2rem;
  display: inline-block;
}
#deadline-btn {
  width: 45px;
  height: 34px;
  padding: 0.2rem;
  padding-left: 0.4rem;
}
.field-auto {
  display: inline-block;
}
.group-field {
  margin-bottom: .75rem;
  width: 100%;
  display: flex;
}
.dashboard.is-dark {
    color: '#dddddf' !important
}
.navbar-burger {
  display: block !important;
}
  @import "assets/app.scss";

</style>
<style src="@cyradar/ui/dist/ui.css"></style>
